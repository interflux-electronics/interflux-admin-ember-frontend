import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductUseModel extends Model {
  @attr('number') rankAmongUses;
  @attr('number') rankAmongProducts;

  @belongsTo('product') product;
  @belongsTo('use') use;
}
