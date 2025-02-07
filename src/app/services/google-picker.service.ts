import { Injectable } from '@angular/core';
declare var gapi: any;
declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GooglePickerService {
  private readonly SCOPES =
    'https://www.googleapis.com/auth/drive.metadata.readonly';
  private readonly CLIENT_ID = 'YOUR_CLIENT_ID';
  private readonly API_KEY = 'YOUR_API_KEY';
  private readonly APP_ID = 'YOUR_APP_ID';
  private tokenClient: any;
  private accessToken: string | null = null;
  private pickerInited = false;
  private gisInited = false;

  constructor() {
    this.loadGoogleApi();
    this.loadGoogleSignin();
  }

  private loadGoogleApi() {
    gapi.load('client:picker', () => {
      gapi.client
        .load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
        .then(() => {
          this.pickerInited = true;
          this.maybeEnableButtons();
        });
    });
  }

  private loadGoogleSignin() {
    google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (response: any) => {
        if (response.error !== undefined) {
          throw response;
        }
        this.accessToken = response.access_token;
        this.createPicker();
      },
    });
    this.gisInited = true;
    this.maybeEnableButtons();
  }

  private maybeEnableButtons() {
    if (this.pickerInited && this.gisInited) {
      // Logic to show authorize and sign-out buttons
    }
  }

  public handleAuthClick() {
    if (this.accessToken === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  public handleSignoutClick() {
    if (this.accessToken) {
      this.accessToken = null;
      google.accounts.oauth2.revoke(this.accessToken);
      // Logic to clear content and update button visibility
    }
  }

  private createPicker() {
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes('image/png,image/jpeg,image/jpg,application/pdf');
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(this.API_KEY)
      .setAppId(this.APP_ID)
      .setOAuthToken(this.accessToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setCallback(this.pickerCallback)
      .build();
    picker.setVisible(true);
  }

  private pickerCallback(data: any) {
    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
      let text = `Picker response: \n${JSON.stringify(data.docs, null, 2)}\n`;
      const document = data[google.picker.Response.DOCUMENTS][0];
      const fileId = document[google.picker.Document.ID];
      gapi.client.drive.files
        .get({
          fileId: fileId,
          fields: '*',
        })
        .then((res: any) => {
          // Handle Drive API response
        });
    }
  }
}
