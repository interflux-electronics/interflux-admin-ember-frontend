import Model, { attr, belongsTo } from '@ember-data/model';

export default class EventAttendeeModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') role;
  @attr('string') company;
  @attr('string') email;

  @belongsTo('event') event;
  @belongsTo('person') person;
}
