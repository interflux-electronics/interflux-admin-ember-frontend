import Model, { belongsTo } from '@ember-data/model';

export default class ProductFamilyImageModel extends Model {
  @belongsTo('product-family') productFamily;
  @belongsTo('image') image;
}
