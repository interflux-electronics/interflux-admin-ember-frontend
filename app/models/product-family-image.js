import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductFamilyImageModel extends Model {
  @attr('number') rankAmongFamilies;
  @attr('number') rankAmongImages;

  @belongsTo('product-family') productFamily;
  @belongsTo('image') image;
}
