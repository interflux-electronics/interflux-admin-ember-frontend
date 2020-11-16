import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ImageModel extends Model {
  @attr('string') path;
  @attr('string') alt;
  @attr('string') caption;
  @attr('string') variations;

  @belongsTo('product', { inverse: 'image' }) product;
  @hasMany('product', { inverse: 'images' }) products;
  @hasMany('product-image') productImages;
  @hasMany('cdn-files') files;

  @belongsTo('company') company;

  get category() {
    return this.path.split('/')[1];
  }

  get JPGs() {
    return this.files.filterBy('isJPG').sortBy('width');
  }

  get PNGs() {
    return this.files.filterBy('isPNG').sortBy('width');
  }

  get WEBPs() {
    return this.files.filterBy('isWEBP').sortBy('width');
  }
}
