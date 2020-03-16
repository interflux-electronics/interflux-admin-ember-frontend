import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') chineseName;
  @attr('string') phone;
  @attr('string') email;
  @attr('boolean') male;

  get fullName() {
    return [this.firstName, this.lastName, this.chineseName].join(' ');
  }
}
