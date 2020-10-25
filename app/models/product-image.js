import Model, { attr, belongsTo } from '@ember-data/model';

export default class ImageModel extends Model {
  @belongsTo('product') product;
  @belongsTo('image') image;

  @attr('boolean', { defaultValue: false }) public;
  @attr('number', { defaultValue: 999 }) rank;
}
