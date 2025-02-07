import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.css'],
})
export class GoogleDriveComponent implements OnInit {
  @Output() fileSelected = new EventEmitter<any>();

  private SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
  private CLIENT_ID =
    // '327003552151-odmbct17ltop2gbgf82t2l7t74c0ns2u.apps.googleusercontent.com';
    '447049840964-r8h8km0m45se69lm894t8l0m6tm1en19.apps.googleusercontent.com';
  // private API_KEY = 'AIzaSyCl9Fx4MPG_I2UnMATPoa7Fpx9lnPTGZ1M';
  private API_KEY = 'AIzaSyBME5AhuixSlxS9xFSp7NTD5rQL0xxCO7E';
  // private APP_ID = 'driveaccess-43';
  private APP_ID = 'skyline-13d78';

  private tokenClient: any;
  private accessToken: string | null = null;
  private pickerInited = false;
  private gisInited = false;

  ngOnInit(): void {
    (window as any).gapiLoaded = this.gapiLoaded.bind(this);
    (window as any).gisLoaded = this.gisLoaded.bind(this);

    this.loadGapiScript();
    this.loadGisScript();
  }

  private loadGapiScript() {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => (window as any).gapiLoaded();
    document.body.appendChild(gapiScript);
  }

  private loadGisScript() {
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    gisScript.onload = () => (window as any).gisLoaded();
    document.body.appendChild(gisScript);
  }

  private gapiLoaded() {
    (window as any).gapi.load(
      'client:picker',
      this.initializePicker.bind(this)
    );
  }

  private async initializePicker() {
    await (window as any).gapi.client.load(
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
    );
    this.pickerInited = true;
    this.maybeEnableButtons();
  }

  private gisLoaded() {
    this.tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '',
    });
    this.gisInited = true;
    this.maybeEnableButtons();
  }

  private maybeEnableButtons() {
    if (this.pickerInited && this.gisInited) {
      document.getElementById('authorize_button')!.style.visibility = 'visible';
    }
  }

  handleAuthClick() {
    this.tokenClient.callback = async (response: any) => {
      if (response.error !== undefined) {
        throw response;
      }
      this.accessToken = response.access_token;
      // document.getElementById('signout_button')!.style.visibility = 'visible';
      document.getElementById('authorize_button')!.innerText = 'Refresh';
      await this.createPicker();
    };

    if (this.accessToken === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  handleSignoutClick() {
    if (this.accessToken) {
      (window as any).google.accounts.oauth2.revoke(this.accessToken);
      this.accessToken = null;
      document.getElementById('content')!.innerText = '';
      document.getElementById('authorize_button')!.innerText = 'Authorize';
      document.getElementById('signout_button')!.style.visibility = 'hidden';
    }
  }

  private async createPicker() {
    const view = new (window as any).google.picker.View(
      (window as any).google.picker.ViewId.DOCS
    );
    view.setMimeTypes(
      'application/pdf,application/msword,text/plain'
    );
    const picker = new (window as any).google.picker.PickerBuilder()
      .enableFeature((window as any).google.picker.Feature.NAV_HIDDEN)
      .enableFeature((window as any).google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(this.API_KEY)
      .setAppId(this.APP_ID)
      .setOAuthToken(this.accessToken)
      .addView(view)
      .addView(new (window as any).google.picker.DocsUploadView())
      .setCallback(this.pickerCallback.bind(this))
      .build();
    picker.setVisible(true);
  }

  // private async pickerCallback(data: any) {
  //   if (data.action === (window as any).google.picker.Action.PICKED) {
  //     let text = `Picker response: \n${JSON.stringify(data.docs, null, 2)}\n`;
  //     const document = data[(window as any).google.picker.Response.DOCUMENTS][0];
  //     const fileId = document[(window as any).google.picker.Document.ID];
  //     console.log(fileId);
  //     const res = await (window as any).gapi.client.drive.files.get({
  //       fileId: fileId,
  //       fields: '*',
  //     });
  //     window.document.getElementById('content')!.innerText = text;
  //   }
  // }

  private async pickerCallback(data: any) {
    if (data.action === (window as any).google.picker.Action.PICKED) {
      const document = data[(window as any).google.picker.Response.DOCUMENTS][0];
      const fileId = document[(window as any).google.picker.Document.ID];

      console.log(fileId);
      const res = await (window as any).gapi.client.drive.files.get({
        fileId: fileId,
        fields: '*',
      });

      // console.log(res, 'res are');
      // Emit the file data to the parent component
      this.fileSelected.emit(res);
    }
  }
}
