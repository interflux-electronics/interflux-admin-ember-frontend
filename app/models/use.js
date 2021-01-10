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
    return this.products.mapBy('family').uniqBy('id');
  }

  get url() {
    return `${ENV.wwwHost}/en/products/for-${this.id}`;
  }
}
