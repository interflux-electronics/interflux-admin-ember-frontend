import Model, { attr, belongsTo } from '@ember-data/model';

export default class UseImageModel extends Model {
  @attr('number') rankAmongUses;
  @attr('number') rankAmongImages;

  @belongsTo('use') use;
  @belongsTo('image') image;
}
