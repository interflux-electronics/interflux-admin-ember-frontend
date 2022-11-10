import Model, { attr } from '@ember-data/model';

export default class EventModel extends Model {
  @attr('string') name;
  @attr('string') startDate;
  @attr('string') endDate;
  @attr('string') location;
  @attr('string') callToAction;
}
