import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private siteKey = '6LcdoZgqAAAAAJVuQvTWsV4LWA8Z5m3D1UQIS52h'; // Replace with your site key

  constructor() {}

  executeRecaptcha(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject('Google reCAPTCHA not loaded');
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(this.siteKey, { action })
          .then((token: string) => {
            resolve(token);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    });
  }
}
