import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class ProductFamilyModel extends Model {
  @attr('string') slug;
  @attr('string') nameSingle;
  @attr('string') namePlural;
  @attr('string') gist;
  @attr('string') theFullMonty;
  @attr('number') rank;

  @belongsTo('product-family', { inverse: 'children' }) productFamily;
  @hasMany('product-family', { inverse: 'productFamily' }) children;

  @hasMany('product') products;
  @hasMany('product-family-image') productFamilyImages;

  @hasMany('product', { inverse: 'mainFamily' }) productsWithMain;
  @hasMany('product', { inverse: 'subFamily' }) productsWithSub;

  get url() {
    return `${ENV.publicHost}/en/products/${this.slug}`;
  }

  get link() {
    return this.url.replace('https://', '').replace('http://', '');
  }

  get isSubFamily() {
    return this.productFamily.get('id') ? true : false;
  }

  get isMainFamily() {
    return !this.isSubFamily;
  }

  // Returns plural family name with first letter capitalised
  get label() {
    const str = this.namePlural || '';
    return str[0].toUpperCase() + str.slice(1);
  }

  get subsetOf() {
    return this.productFamily.get('namePlural') || '-';
  }

  get canBeDeleted() {
    return this.productCount === 0 && this.imagesCount === 0;
  }

  get productCount() {
    return this.products.length;
  }

  get imagesCount() {
    return this.productFamilyImages.length;
  }
}
