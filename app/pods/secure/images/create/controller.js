import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import ENV from 'interflux/config/environment';

export default class ImageCreateController extends Controller {
  @service api;
  @service auth;
  @service store;
  @service router;

  @tracked subject = null;
  @tracked product = null;
  @tracked products = null;

  @tracked loadingProducts = true;
  @tracked loadingProductImages = true;

  get image() {
    return this.model.image;
  }

  get subjects() {
    return [
      {
        id: 'product',
        label: 'a product'
      },
      {
        id: 'other',
        label: 'something else'
      }
    ];
  }

  @action
  async onSelectSubject(subject) {
    this.subject = subject;
    if (!subject) {
      return;
    }
    if (subject.id === 'product') {
      this.loadingProducts = true;
      this.products = await this.store.findAll('product');
      this.loadingProducts = false;
    }
  }

  @action
  async onSelectProduct(product) {
    this.product = product;
    if (!product) {
      return;
    }
    this.loadingProductImages = true;
    this.product = await this.store.findRecord('product', this.product.id, {
      include: [
        'product_images',
        'product_images.image',
        'product_family',
        'product_family.product_family'
      ].join(',')
    });
    await this.delay(1000);
    this.loadingProductImages = false;
  }

  delay(ms) {
    return new Promise((approve) => {
      window.setTimeout(approve, ms);
    });
  }

  // UPLOAD

  @tracked uploading = false;
  @tracked errorMessage = false;
  @tracked imageURL;
  @tracked progress;

  @action
  async onImageSelect(event) {
    const files = event.target.files;
    const file = files[0];

    if (!file) {
      this.errorMessage = `No file selected...`;
      return;
    }

    const maxSize = 10; // MB
    const size = Math.round((file.size / 1024 / 1024).toFixed(4) * 10) / 10; // MB

    if (size > maxSize) {
      this.errorMessage = `File size is too large: ${size}MB.`;
      return;
    }

    this.uploading = true;

    this.imageURL = await this.uploadImage(file);

    if (!this.imageURL) {
      this.errorMessage = 'Sorry, we were unable to upload your file.';
      console.error('image not uploaded!');
      return;
    }
  }

  async uploadImage(file) {
    console.log('uploadImage()');
    console.log({ file });

    const date = new Date()
      .toLocaleString('sv', { timeZone: 'UTC' })
      .replace(/:|\s/g, '-');
    const fileExt = file.name.split('.').pop(-1);
    const fileName = `${date}.${fileExt}`;

    this.fakeProgress(3, 1);
    this.fakeProgress(8, 500);
    this.fakeProgress(12, 1000);
    this.fakeProgress(19, 1500);
    this.fakeProgress(23, 2000);
    this.fakeProgress(27, 2500);
    this.fakeProgress(31, 3000);
    this.fakeProgress(36, 3500);

    // Hit API for pre-signed URL
    const response = await this.fetchUploadURL(fileName);

    if (!response) {
      console.warn('no response');
      return null;
    }

    const { uploadURL, cdnPath } = response;

    console.log({ uploadURL, cdnPath });

    if (!uploadURL) {
      console.warn('no uploadURL');
      return null;
    }

    if (!cdnPath) {
      console.warn('no cdnPath');
      return null;
    }

    // Hit CDN API for uploading file
    const uploadSuccess = await this.uploadFileToCDN(uploadURL, file);

    console.debug({ uploadSuccess });

    if (!uploadSuccess) {
      console.warn('upload failed');
      return null;
    }

    console.log('upload success');

    return `https://cdn-interflux.fra1.digitaloceanspaces.com/${cdnPath}`;
  }

  // The start of the upload can be quite slow. For several seconds user get to see 0% and
  // it then picks up speed. This fake progress aims to make people patient at the start.
  async fakeProgress(fakeProgress, ms) {
    await this.delay(ms);
    if (this.progress < fakeProgress) {
      this.progress = fakeProgress;
    }
  }

  async fetchUploadURL(fileName) {
    return new Promise((resolve, reject) => {
      const { apiHost } = ENV;
      const url = `${apiHost}/v1/public/simulation-requests/image-upload-url`;

      console.log('---');
      console.log('fetchUploadURL');
      console.log({ apiHost, url, fileName });
      console.log('---');

      return fetch(url, {
        method: 'POST',
        body: JSON.stringify({ fileName }),
        headers: new Headers(this.api.headers)
      })
        .then((response) => response.json())
        .then((data) => {
          resolve({
            uploadURL: data['upload-url'],
            cdnPath: data['cdn-path']
          });
        })
        .catch((response) => {
          console.error('failed to fetch upload URL');
          console.error(response);
          this.errorMessage = 'Sorry, we were unable to upload your image.';
          reject();
        });
    });
  }

  get preventSave() {
    return true;
  }

  @action
  async onSave() {
    this.isSaving = true;

    const success = () => {
      this.router.transitionTo('secure.images.image', this.image.id);
    };

    const fail = (error) => {
      console.error('save failed', error);
    };

    const done = () => {
      this.isSaving = false;
    };

    this.person
      .save({
        adapterOptions: {
          whitelist: ['path', 'alt']
        }
      })
      .then(success)
      .catch(fail)
      .finally(done);
  }
}
