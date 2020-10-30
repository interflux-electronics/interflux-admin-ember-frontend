import Model, { belongsTo } from '@ember-data/model';

export default class ProductFeatureModel extends Model {
  @belongsTo('product') product;
  @belongsTo('feature') feature;
}
