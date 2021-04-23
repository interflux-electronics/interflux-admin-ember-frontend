import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class UseModel extends Model {
  @attr('string') icon;
  @attr('string') text;
  @attr('string') gist;
  @attr('number') rank;

  @belongsTo('image') image;

  @hasMany('product-use') productUses;
  @hasMany('product') products;

  @hasMany('use-image') useImages;

  get families() {
    return this.products.mapBy('family').uniqBy('id').filterBy('id');
  }

  get url() {
    return `${ENV.wwwHost}/en/products/for-${this.id}`;
  }

  get link() {
    return this.url.replace('https://', '').replace('http://', '');
  }

  get images() {
    return this.useImages.sortBy('rankAmongImages');
  }

  get label() {
    const str = this.text || '';
    return str[0].toUpperCase() + str.slice(1);
  }

  get iconURL() {
    return this.icon
      ? `${ENV.cdnHost}/${this.icon}`
      : `${ENV.cdnHost}/images/icons/check.svg`;
  }
}
