import Model, { attr } from '@ember-data/model';

export default class ProductModel extends Model {
  @attr('string') slug;
  @attr('string') name;
  @attr('boolean') public;
}
