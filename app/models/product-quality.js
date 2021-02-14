import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductQualityModel extends Model {
  @attr('number') rankAmongQualities;
  @attr('number') rankAmongProducts;

  @belongsTo('product') product;
  @belongsTo('quality') quality;
}
