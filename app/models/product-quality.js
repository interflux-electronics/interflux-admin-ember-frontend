import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductQualityModel extends Model {
  @belongsTo('product') product;
  @belongsTo('quality') quality;

  @attr('number') rankAmongProducts;
  @attr('number') rankAmongQualities;

  @attr('boolean') showOnProductList;
}
