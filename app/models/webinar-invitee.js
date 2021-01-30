import Model, { belongsTo } from '@ember-data/model';

export default class WebinarInvitee extends Model {
  @belongsTo('webinar') webinar;
  @belongsTo('person') person;
}
