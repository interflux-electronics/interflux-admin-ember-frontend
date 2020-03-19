import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') email;

  @belongsTo('person') person;
}
