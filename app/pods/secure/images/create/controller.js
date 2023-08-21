import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import ENV from 'interflux/config/environment';

export default class ImageCreateController extends Controller {
  @service api;
  @service auth;
  @service cdn;
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
        'images',
        'product_images',
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

  // SELECT & PREVIEW IMAGE

  @tracked file;
  @tracked extension;
  @tracked localImageURL;
  @tracked width;
  @tracked height;
  @tracked n;
  @tracked cdnBasePath;

  @action
  async onClickSelectFile() {
    this.file = await this.selectFile();
    this.extension = this.file.name.split('.').pop(-1);
    this.localImageURL = URL.createObjectURL(this.file);
  }

  selectFile() {
    return new Promise((resolve) => {
      let input = document.createElement('input');
      input.type = 'file';
      input.accept = '.png,.jpg';
      input.onchange = () => {
        const files = Array.from(input.files);
        const file = files[0];
        return resolve(file);
      };
      input.click();
    });
  }

  @action
  async onLocalImageLoad(event) {
    const img = event.target;
    this.width = img.naturalWidth;
    this.height = img.naturalHeight;
    this.cdnBasePath = await this.findUniquePath();
  }

  async findUniquePath() {
    let path = `images/products/${this.product.id}/${this.product.id}`;

    if (ENV.isDevelopment) {
      path = `temporary/${path}`;
    }

    this.n = 1;

    let done = false;

    while (!done) {
      const temp = `${path}-${this.n}`;
      console.log(temp);
      const image = await this.store.findRecord('image', temp).catch(() => {
        return null;
      });
      if (image) {
        this.n += 1;
      } else {
        path = temp;
        done = true;
      }
    }

    return path;
  }

  // UPLOAD

  @tracked uploadCommenced = false;
  @tracked uploadError = false;
  @tracked uploadSuccess = false;
  @tracked uploadOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  @action
  onSelectUploadOption(option) {
    if (option.value === 'no') {
      this.localImageURL = null;
    } else {
      this.upload();
    }
  }

  get uploadProgressStyle() {
    return htmlSafe(`width: ${this.cdn.uploadProgress}%`);
  }

  async upload() {
    this.uploadCommenced = true;

    try {
      const { cdnBasePath, file, extension, width, height, n } = this;

      const cdnPath = `${cdnBasePath}@${width}x${height}.original.${extension}`;

      console.debug({ file });
      console.debug({ cdnBasePath });
      console.debug({ cdnPath });
      console.debug('fetching upload URL');

      const uploadURL = await this.cdn.fetchUploadURL(cdnPath);

      console.debug({ uploadURL });

      if (!uploadURL) {
        throw new Error('no uploadURL');
      }

      console.debug('uploading file to CDN');

      const uploadSuccess = await this.cdn.uploadFile(uploadURL, file);

      console.debug({ uploadSuccess });

      if (!uploadSuccess) {
        throw new Error('upload failed');
      }

      console.debug('creating Image record');

      const imageRecord = await this.store
        .createRecord('image', {
          path: cdnBasePath,
          alt: `${this.product.name} #${n}`,
          original: `@${width}x${height}.original.${extension}`,
          variations: null, // These will be added later
          uploadedBy: this.auth.user
        })
        .save();

      console.debug({ imageRecord });

      if (!imageRecord) {
        throw new Error('unable to create Image');
      }

      const productImageRecord = await this.store
        .createRecord('product-image', {
          product: this.product,
          image: imageRecord
        })
        .save();

      console.debug({ productImageRecord });

      if (!productImageRecord) {
        throw new Error('unable to create ProductImage');
      }

      this.image = imageRecord;
      this.uploadSuccess = true;
    } catch (msg) {
      console.error(msg);
      this.uploadError = true;
    }

    this.convert();
  }

  // CONVERSION

  @tracked conversionProgress = 0;
  @tracked conversionError = false;
  @tracked conversionSuccess = false;
  @tracked conversionOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  get conversionProgressStyle() {
    return htmlSafe(`width: ${this.conversionProgress}%`);
  }

  // Conversion is done by a background task in Rails.
  // The only way to know whether it has completed is to poll the backend for updates.
  // In the mean time we move the progress bar at a rate similar to the average conversion of a 2400x2400 PNG.
  async convert() {
    let done = false;

    while (!done) {
      await this.delay(1000);
      const image = await this.store.findRecord('image', this.image.id);

      // Something is wrong
      if (image.conversionErrorLog) {
        this.conversionError = true;
        done = true;
        break;
      }

      // We're done!
      if (!image.converting && image.variations) {
        this.conversionSuccess = true;
        this.conversionProgress = 100;
        done = true;
        break;
      }

      // Keep polling
      let p = Math.round(this.conversionProgress + 1.3);
      if (p > 98) {
        p = 98;
      }
      this.conversionProgress = p;
    }
  }

  // IMAGE

  @tracked image;
}
