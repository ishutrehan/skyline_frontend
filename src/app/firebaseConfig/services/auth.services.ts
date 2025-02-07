import { Injectable, NgZone } from '@angular/core';
import { UserInterface } from './userInterface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FacebookAuthProvider, GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, Observable, ReplaySubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  allUsers: ReplaySubject<any> = new ReplaySubject<any>();
  private userDataSubject = new BehaviorSubject<any>(null); // Store user data
  userData$: Observable<any> = this.userDataSubject.asObservable(); // Expose as Observable

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
     logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user:any) => {
      if (user) {
        console.log('now user: ', user);
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });

    // Get all accounts for statistics
    this.getAccounts();
  }

  // Sign in with email/password
  async SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result:any) => {
        // this.ngZone.run(() => {
        //   this.router.navigate(['dashboard']);
        // });
        this.setUserData(result.user);
      })
      .catch((error:Error) => {
        // window.alert(error.message);
      });
  }

  // Sign up with email/password
  async SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result:any) => {
        /* Call the SendVerificationMail() function when new user sign
                  up and returns promise */
        this.SendVerificationMail();
        this.setUserData(result.user);
      })
      .catch((error:any) => {
        const code = error.code;
        const credential = error.credential;

        console.log({ error });
        if (code === 'auth/email-already-in-use') {
          
          // Get other Auth providers user has used before (e.g google.com)
          this.afAuth.fetchSignInMethodsForEmail(email).then((result) => {
            console.log(result);
            const provider = this.getAuthProvider(result[0]);
            // Log in the user with other provider used before
            this.authLogin(provider).then((result) => {
              this.afAuth.authState.pipe(take(1)).subscribe((user) => {
                if (user) {
                  user.linkWithCredential(credential).then(() => {
                    console.log('Credential linked successfully: ', credential);
                  });
                }
              });
            });
          });
        }
      });
  }

  // Send email verification when new user sign up
  async SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forgot password
  async ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error:Error) => {
        window.alert(error);
      });
  }

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.uid !== null;
  }

  getAuthProvider(provider: string) {
    if (provider !== 'google.com') {
      return new FacebookAuthProvider();
    } else {
      return new GoogleAuthProvider();
    }
  }

  // Sign in with Google
  async GoogleAuth() {
    console.log('hellog google==========================================');
    return await this.authLogin(new GoogleAuthProvider()).then(() => {});
  }

  // Sign in with Facebook
  async FacebookAuth() {
    return await this.authLogin(new FacebookAuthProvider()).then(() => {});
  }

  // Auth logic to run auth providers
  // Auth logic to run auth providers
  async authLogin(provider: any) {
    return await this.afAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        // Wait for the auth state to be updated before redirecting
        this.afAuth.authState.pipe(take(1)).subscribe((user) => {
          if (user) {
            this.setUserData(result.user);
            // this.ngZone.run(() => {
            //   this.router.navigate(['dashboard']);
            // });
          }
        });
      })
      .catch(async (error) => {
        console.log(error, 'error ');
        const code = error.code;
        const credential = error.credential;

        if (code === 'auth/account-exists-with-different-credential') {
          // User tried to sign in with a different provider using the same email
          const email = error.email;
          const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
          const otherProvider = this.getAuthProvider(methods[0]);

          // Now sign in with the original provider the user used
          const signInResult = await this.afAuth.signInWithPopup(otherProvider);
          if (signInResult.user) {
            await signInResult.user.linkWithCredential(credential);
            await this.setUserData(signInResult.user);
            this.ngZone.run(() => {
              this.router.navigate(['dashboard']);
            });
          }
        } else {
          console.error('Authentication Error: ', error);
          window.alert(error.message);
        }
      });
  }

  /* Setting up user data when sign in with username/password,
   sign up with username/password and sign in with social auth
   provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
    console.log(user, 'user details');
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: UserInterface = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      insertTime: new Date().toISOString(),
    };
    this.userDataSubject.next(userData); // Update userDataSubject with new user data
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  async onSignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      // this.router.navigate(['sign-in']);
    });
  }

  onDeleteAccount() {
    let itemDoc = this.afs.doc<UserInterface>('users/' + this.userData.uid);
    itemDoc.delete().then(() => this.onSignOut());
    this.afAuth.currentUser.then((user) => user?.delete());
  }

  getAccounts() {
    const collection = this.afs.collection('users').get();
    collection.subscribe((data:any) => this.allUsers.next(data));
  }
}
