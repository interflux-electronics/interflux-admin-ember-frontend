import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductUseModel extends Model {
  @belongsTo('product') product;
  @belongsTo('use') use;

  @attr('number') rankAmongProducts;
  @attr('number') rankAmongUses;

  @attr('boolean') showOnProductList;
}
