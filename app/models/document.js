import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class DocumentModel extends Model {
  @attr('string') path;
  @attr('string') name;
  @attr('string') variations;
  @attr('boolean') public;

  @belongsTo('document-category') documentCategory;

  @hasMany('product') products;
  @hasMany('product-document') productDocuments;
  @hasMany('cdn-file') cdnFiles;

  get category() {
    return this.documentCategory;
  }

  get files() {
    return this.cdnFiles;
  }
}
