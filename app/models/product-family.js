import Model, { attr, hasMany } from '@ember-data/model';

export default class ProductFamilyModel extends Model {
  @attr('string') slug;
  @attr('string') code;
  @attr('string') nameSingle;
  @attr('string') namePlural;

  @hasMany('product') products;
}
