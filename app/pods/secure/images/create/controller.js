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

  // ASK THE SUBJECT OF THE IMAGE

  @tracked subject = null;

  get subjects() {
    return [
      {
        id: '1',
        model: 'product',
        label: 'a product',
        sort: 'name'
      },
      {
        id: '2',
        model: 'person',
        label: 'a person',
        sort: 'fullName'
      },
      {
        id: '3',
        label: 'something else'
      }
    ];
  }

  @action
  async onSelectSubject(subject) {
    this.subject = subject;
    if (!subject || !subject.model) {
      return;
    }
    this.loadingOptions = true;
    this.options = await this.store.findAll(this.subject.model);
    this.loadingOptions = false;
  }

  // ASK WHICH SUBJECT RECORD TO LINK THE IMAGE TO

  @tracked loadingOptions = null;
  @tracked options = null;
  @tracked selectedOption = null;

  get sortedOptions() {
    return this.options.sortBy(this.subject.sort);
  }

  @action
  async onSelectOption(option) {
    this.selectedOption = option;
    if (!option) {
      return;
    }
    this.loadingImages = true;
    const { id } = this.selectedOption;

    if (this.subject.model === 'product') {
      const product = await this.store.findRecord('product', id, {
        include: [
          'images',
          'product_images',
          'product_family',
          'product_family.product_family'
        ].join(',')
      });
      this.selectedOption = product;
      await this.delay(1000);
      this.images = product.productImages.mapBy('image');
    }

    if (this.subject.model === 'person') {
      const person = await this.store.findRecord('person', id, {
        include: ['images', 'person_images'].join(',')
      });
      await this.delay(1000);
      this.images = person.personImages.mapBy('image');
    }

    this.loadingImages = false;
  }

  // SHOW EXISTING IMAGES

  @tracked loadingImages = true;
  @tracked images = null;

  // ASK TO SELECT FILE TO UPLOAD

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

  // SHOW PREVIEW OF THE IMAGE SELECTED

  @action
  async onLocalImageLoad(event) {
    const img = event.target;
    this.width = img.naturalWidth;
    this.height = img.naturalHeight;
    this.cdnBasePath = await this.findUniquePath();
  }

  async findUniquePath() {
    let path = null;

    if (this.subject.model === 'product') {
      const product = this.selectedOption;

      path = `images/products/${product.id}/${product.id}`;
    }

    if (this.subject.model === 'person') {
      const person = this.selectedOption;

      path = `images/people/${person.slug}/${person.slug}`;
    }

    if (!path) {
      console.error('no path for image upload!');
      return;
    }

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

  // ASK WHETHER TO COMMENCE THE UPLOAD

  @tracked selectedUploadOption = null;

  @action
  onSelectUploadOption(option) {
    if (option.value === 'no') {
      this.localImageURL = null;
    } else {
      this.upload();
    }
  }

  // UPLOAD THE IMAGE TO THE CDN

  @tracked uploadCommenced = false;
  @tracked uploadError = false;
  @tracked uploadSuccess = false;
  @tracked uploadOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

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

      let alt = null;
      const { model } = this.subject;

      if (model === 'product') {
        const product = this.selectedOption;
        alt = `${product.name} #${n}`;
      }

      if (model === 'person') {
        const person = this.selectedOption;
        alt = `${person.fullName} #${n}`;
      }

      const imageRecord = await this.store
        .createRecord('image', {
          path: cdnBasePath,
          alt,
          original: `@${width}x${height}.original.${extension}`,
          variations: null, // These will be added later
          user: this.auth.user
        })
        .save();

      console.debug({ imageRecord });

      if (!imageRecord) {
        throw new Error('unable to create Image');
      }

      let relation = null;

      if (model === 'product') {
        relation = this.store.createRecord('product-image', {
          product: this.selectedOption,
          image: imageRecord
        });
      }

      if (model === 'person') {
        relation = this.store.createRecord('person-image', {
          person: this.selectedOption,
          image: imageRecord
        });
      }

      console.debug({ relation });

      if (!relation) {
        throw new Error('no relation');
      }

      await relation.save();

      if (!relation) {
        throw new Error('unable to create relation');
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

  // TODO: do these conflict?

  @tracked image;

  get image() {
    return this.model.image;
  }

  // HELPER

  delay(ms) {
    return new Promise((approve) => {
      window.setTimeout(approve, ms);
    });
  }
}
