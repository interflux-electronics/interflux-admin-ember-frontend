import Model, { attr, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') chineseName;
  @attr('string') fullName;
  @attr('string') phone;
  @attr('string') email;
  @attr('boolean') public;

  @hasMany('company') companies;
  @hasMany('company-member') companyMembers;

  get memberOf() {
    return this.companies.mapBy('businessName').join(', ');
  }
}
