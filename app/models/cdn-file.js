import Model, { attr, belongsTo } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class CdnFileModel extends Model {
  @attr('string') path;

  @belongsTo('image') image;
  @belongsTo('video') video;
  @belongsTo('document') document;

  get url() {
    return `${ENV.cdnHost}/${this.path}`;
  }

  get label() {
    if (this.isVideo) {
      return [this.size, this.standard, this.ratio].join(' - ');
    }
    return this.path.split('/').slice(-1).pop();
  }

  get isVideo() {
    return this.isWEBM || this.isMP4;
  }

  get isJPG() {
    return this.path.endsWith('.jpg');
  }

  get isWEBP() {
    return this.path.endsWith('.webp');
  }

  get isPNG() {
    return this.path.endsWith('.png');
  }

  get isSVG() {
    return this.path.endsWith('.svg');
  }

  get isWEBM() {
    return this.path.endsWith('.webm');
  }

  get isMP4() {
    return this.path.endsWith('.mp4');
  }

  get size() {
    return this.path.includes('@')
      ? this.path.split('@')[1].split('.')[0]
      : null;
  }

  get width() {
    return this.size ? Number(this.size.split('x')[0]) : null;
  }

  get height() {
    return this.size ? Number(this.size.split('x')[1]) : null;
  }

  get standard() {
    if (this.size === '1920x1080') {
      return 'HD 1080p';
    }
    return null;
  }

  get ratio() {
    if (this.width / 16 === this.height / 9) {
      return '16:9';
    }
    return null;
  }
}
