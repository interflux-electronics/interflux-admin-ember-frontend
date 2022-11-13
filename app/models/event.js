import Model, { attr, belongsTo } from '@ember-data/model';

export default class EventModel extends Model {
  @attr('string') name;
  @attr('string') dates;
  @attr('string') city;
  @attr('string') description;

  @belongsTo('country') country;
}
