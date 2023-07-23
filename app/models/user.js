import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') email;
  @attr('string') abilities;

  @belongsTo('person') person;

  get name() {
    return this.person.get('fullName');
  }

  can(ability) {
    return this.abilities && this.abilities.split(',').includes(ability);
  }
}
