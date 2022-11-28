import Model, { attr, hasMany } from '@ember-data/model';

export default class DocumentCategoryModel extends Model {
  @attr('string') slug;
  @attr('string') name;
  @attr('string') nameSingle;

  @hasMany('document') documents;
}
