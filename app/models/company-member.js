import Model, { attr, belongsTo } from '@ember-data/model';

export default class CompanyMemberModel extends Model {
  @attr('string') title;
  @attr('string') email;
  @attr('string') phone;
  @attr('string') landline;
  @attr('boolean') public;
  @attr('boolean') publicTitle;
  @attr('boolean') publicEmail;
  @attr('boolean') publicPhone;
  @attr('boolean') publicLandline;
  @attr('number') rankAmongCompanies;
  @attr('number') rankAmongMembers;

  @belongsTo('company') company;
  @belongsTo('person') person;
}
