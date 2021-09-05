import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') email;
  @attr('string') password;

  @belongsTo('person') person;

  get name() {
    return this.person.get('fullName');
  }
}
