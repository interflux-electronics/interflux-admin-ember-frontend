import Model, { attr, belongsTo } from '@ember-data/model';

export default class DocumentModel extends Model {
  @attr('string') path;
  @attr('string') name;

  @belongsTo('language') language;
}
