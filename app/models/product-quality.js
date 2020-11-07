import Model, { belongsTo } from '@ember-data/model';

export default class ProductQualityModel extends Model {
  @belongsTo('product') product;
  @belongsTo('quality') quality;
}
