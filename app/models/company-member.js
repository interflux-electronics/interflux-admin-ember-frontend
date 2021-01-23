import Model, { attr, belongsTo } from '@ember-data/model';

export default class CompanyPersonModel extends Model {
  @attr('string') title;
  @attr('string') email;
  @attr('string') phone;
  @attr('boolean') public;
  @attr('boolean') publicTitle;
  @attr('boolean') publicEmail;
  @attr('boolean') publicPhone;

  @belongsTo('company') company;
  @belongsTo('person') person;
}
