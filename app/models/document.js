import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class DocumentModel extends Model {
  @attr('string') path;
  @attr('string') name;
  @attr('string') locale;
  @attr('string') variations; // best way?
  @attr('boolean') public;

  @belongsTo('document-category') documentCategory;

  @hasMany('cdn-file') cdnFiles;
  @hasMany('product-document') productDocuments;
  @hasMany('product') products;

  get files() {
    return this.cdnFiles;
  }

  get category() {
    return this.documentCategory;
  }

  get cdnBasePath() {
    const category = this.documentCategory.get('slug');
    return `documents/${category}/${this.name}`.replace(/\s/g, '-');
  }
}
