import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// import ENV from 'interflux/config/environment';

export default class CdnService extends Service {
  @service api;

  @tracked uploadProgress = 0;

  async fetchUploadURL(cdnPath) {
    if (!cdnPath) {
      console.warn('no CDN path');
      return;
    }

    return new Promise((resolve, reject) => {
      fetch(`${this.api.url}/create-upload-url`, {
        method: 'POST',
        headers: this.api.headers,
        body: JSON.stringify({ cdnPath })
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data.url);
        })
        .catch((response) => {
          console.error('failed to fetch upload URL');
          console.error(response);
          reject();
        });
    });
  }

  async uploadFile(uploadURL, file) {
    if (!uploadURL) {
      console.warn('no upload URL');
      return;
    }

    if (!file) {
      console.warn('no upload file');
      return;
    }

    if (!file) {
      console.warn('upload in progress');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (ev) => {
          this.uploadProgress = Math.round((ev.loaded / ev.total) * 100);
          console.debug(`${this.uploadProgress}%`);
        });
        xhr.addEventListener('load', () => resolve(true));
        xhr.addEventListener('error', () => reject(false));
        xhr.addEventListener('abort', () => reject(false));
        xhr.open('PUT', uploadURL);
        xhr.overrideMimeType(file.type);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.send(file);
      } catch (error) {
        console.error('some random error occured');
        reject(false);
      }
    });
  }
}
