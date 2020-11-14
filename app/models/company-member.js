import Model, { attr, belongsTo } from '@ember-data/model';

export default class CompanyPersonModel extends Model {
  @attr('string') title;
  @attr('string') email;
  @attr('string') phone;
  @attr('boolean') public;

  @belongsTo('company') company;
  @belongsTo('person') person;
}
