import Model, { belongsTo } from '@ember-data/model';

export default class WebinarImageModel extends Model {
  @belongsTo('use') use;
  @belongsTo('image') image;
}
