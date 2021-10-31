import Model, { belongsTo } from '@ember-data/model';

export default class WebinarAttendee extends Model {
  @belongsTo('webinar') webinar;
  @belongsTo('person') person;
}
