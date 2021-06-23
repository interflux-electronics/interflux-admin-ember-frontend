import Model, { attr, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') chineseName;
  @attr('string') fullName;
  @attr('string') phone;
  @attr('string') email;
  @attr('boolean') public;

  @hasMany('company-member') companyMembers;

  get companies() {
    return this.companyMembers.mapBy('company');
  }

  get memberOf() {
    return this.companies.mapBy('businessName').join(', ');
  }

  get companyCount() {
    return this.companies.length;
  }

  get canBeDeleted() {
    return this.companyCount === 0;
  }
}
