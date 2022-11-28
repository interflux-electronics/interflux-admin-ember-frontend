import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import ENV from 'interflux/config/environment';

export default class FileUploaderRowComponent extends Component {
  // @arg record
  // @arg cdnFile
  // @arg language
  // @arg accept
  // @arg uploadTo
  // @arg fileNameBase

  @service api;
  @service auth;
  @service store;
  @service translation;

  // UPLOADING FILES TO CDN

  @tracked uploading = false;
  @tracked uploadFileName; // 'TD-D-5503-EN.pdf'
  @tracked uploadProgress = 0; // percentage integer between 0 and 100
  @tracked uploadFailed = false;

  get progressBarStyle() {
    return htmlSafe(`width: ${this.uploadProgress}%`);
  }

  @action
  async onClickUpload() {
    const { record, cdnFile, cdnBasePath, language } = this.args;

    if (cdnFile) {
      console.warn('no file upload should be possible');
      return;
    }

    const file = await this.selectFile();
    const locale = language ? '-' + language.locale.toUpperCase() : '';
    const ext = file.name.split('.').pop(-1);
    const cdnPath = ENV.isProduction
      ? `${cdnBasePath}${locale}.${ext}`
      : `temporary/${cdnBasePath}${locale}.${ext}`;

    this.uploadFileName = cdnPath.split('/').pop();
    this.uploading = true;
    this.uploadFailed = false;

    console.debug('cdnPath');
    console.debug(cdnPath);

    console.debug('fetching upload URL from API');

    const uploadURL = await this.fetchUploadURL(cdnPath);

    console.debug('uploadURL');
    console.debug(uploadURL);

    if (!uploadURL) {
      this.resetUpload();
      this.uploadFailed = true;
      console.warn('could not generate uploadURL');
      return;
    }

    console.debug('uploading file to CDN');

    const uploadSuccess = await this.uploadFile(uploadURL, file);

    console.debug({ uploadSuccess });

    if (!uploadSuccess) {
      this.resetUpload();
      this.uploadFailed = true;
      console.warn('could not upload file');
      return;
    }

    const newCdnFile = this.store.createRecord('cdn-file', {
      path: cdnPath,
      locale: language.locale,
      originalFileName: file.name,
      user: this.auth.user,
      document: record
    });

    console.debug('creating CDN file record');

    await newCdnFile.save();

    console.debug('newCdnFile');
    console.debug(newCdnFile);

    if (!newCdnFile) {
      this.resetUpload();
      this.uploadFailed = true;
      console.warn('could not create cdnFile record');
      // TODO: remove file from CDN
      return;
    }

    console.log(newCdnFile.id);

    this.resetUpload();
  }

  selectFile() {
    return new Promise((resolve) => {
      let input = document.createElement('input');
      input.type = 'file';
      input.accept = this.args.accept;
      input.onchange = () => {
        const files = Array.from(input.files);
        const file = files[0];
        return resolve(file);
      };
      input.click();
    });
  }

  async fetchUploadURL(cdnPath) {
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

  resetUpload() {
    this.uploading = false;
    this.uploadProgress = 0;
    this.uploadFileName = null;
  }

  // DELETING FILES FROM CDN

  @tracked isDeleting = false;

  @action
  onClickDelete() {
    console.log('deleting cdn File');
    console.log(this.args.cdnFile.path);

    this.isDeleting = true;
    this.args.cdnFile
      .destroyRecord()
      .catch((response) => {
        console.error('delete cdn file failed');
        console.error(response);
      })
      .finally(() => {
        this.isDeleting = false;
      });
  }
}
