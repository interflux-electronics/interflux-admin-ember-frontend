import Model, { attr, belongsTo } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class CdnFileModel extends Model {
  @attr('string') path;

  @belongsTo('image') image;
  @belongsTo('document') document;

  get link() {
    return `${ENV.cdnHost}/${this.path}`;
  }

  get label() {
    return this.path.split('/').slice(-1).pop();
  }
}
