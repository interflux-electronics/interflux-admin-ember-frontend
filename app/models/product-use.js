import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductUseModel extends Model {
  @attr('number') rankAmongProducts;
  @attr('number') rankAmongUses;
  @attr('boolean') showOnListView;
  @attr('boolean') isBest;

  @belongsTo('product') product;
  @belongsTo('use') use;
}
