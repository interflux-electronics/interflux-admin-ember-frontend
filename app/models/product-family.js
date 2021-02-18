import Model, { attr, hasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import ENV from 'interflux/config/environment';

export default class ProductFamilyModel extends Model {
  @alias('id') slug;
  @attr('string') nameSingle;
  @attr('string') namePlural;
  @attr('string') gist;
  @attr('number') order;

  // many to one, families to product
  @hasMany('product') products;
  @attr('string') rankedProducts;

  // many to many, families to images
  @hasMany('product-family-image') productFamilyImages;

  get url() {
    return `${ENV.wwwHost}/en/products/${this.slug}`;
  }

  get link() {
    return this.url.replace('https://', '').replace('http://', '');
  }
}
