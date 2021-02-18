import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductQualityModel extends Model {
  @attr('number') rankAmongProducts;
  @attr('number') rankAmongQualities;

  @belongsTo('product') product;
  @belongsTo('quality') quality;
}
