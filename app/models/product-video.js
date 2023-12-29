import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductVideoModel extends Model {
  @belongsTo('product') product;
  @belongsTo('video') video;

  @attr('boolean', { defaultValue: false }) public;
  @attr('number', { defaultValue: 999 }) rank; // rankAmongVideos
}
