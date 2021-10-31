import Model, { belongsTo } from '@ember-data/model';

export default class WebinarVideoModel extends Model {
  @belongsTo('use') use;
  @belongsTo('video') video;
}
