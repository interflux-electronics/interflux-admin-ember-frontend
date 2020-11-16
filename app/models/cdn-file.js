import Model, { attr, belongsTo } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class CdnFileModel extends Model {
  @attr('string') path;

  @belongsTo('image') image;
  @belongsTo('document') document;

  get url() {
    return `${ENV.cdnHost}/${this.path}`;
  }

  get label() {
    return this.path.split('/').slice(-1).pop();
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

  get size() {
    return this.path.split('@')[1].split('.')[0];
  }

  get width() {
    return Number(this.path.split('@')[1].split('.')[0].split('x')[0]);
  }
}
