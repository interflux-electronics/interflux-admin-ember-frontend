import Model, { attr, belongsTo } from '@ember-data/model';
import { alias } from '@ember/object/computed';

export default class DocumentModel extends Model {
  @attr('string') path;
  @attr('string') name;

  @belongsTo('language') language;
  @belongsTo('document-category') documentCategory;
  @alias('documentCategory') category;
}
