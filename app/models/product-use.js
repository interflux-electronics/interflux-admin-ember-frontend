import Model, { belongsTo } from '@ember-data/model';

export default class ProductUseModel extends Model {
  @belongsTo('product') product;
  @belongsTo('use') use;
}
