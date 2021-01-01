import Model, { belongsTo } from '@ember-data/model';

export default class UseImageModel extends Model {
  @belongsTo('use') use;
  @belongsTo('image') image;
}
