import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';

export default class DocumentModel extends Model {
  @attr('string') path;
  @attr('string') name;

  @belongsTo('document-category') documentCategory;
  @alias('documentCategory') category;

  @hasMany('product') products;
  @hasMany('product-document') productDocuments;
  @hasMany('cdn-file') cdnFiles;
  @alias('cdnFiles') files;
}
