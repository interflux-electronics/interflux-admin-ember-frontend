import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class WebinarModel extends Model {
  @attr('string') title;
  @attr('string') topic;
  @attr('string') audience;
  @attr('string') url;
  @attr('number') startTime; // milliseconds since 1 January 1970
  @attr('number') duration; // minutes
  @attr('boolean') public;

  @belongsTo('person') person;

  @hasMany('person') people;
  @hasMany('webinar-invitees') webinarInvitees;

  get startTimeUTC() {
    return this.formatStartTime('UTC');
  }

  get startTimeBelgium() {
    return this.formatStartTime('Europe/Brussels');
  }

  get startTimeSingapore() {
    return this.formatStartTime('Asia/Singapore');
  }

  get startTimeMelbourne() {
    return this.formatStartTime('Australia/Melbourne');
  }

  formatStartTime(timezone) {
    return this.startTime
      ? new Date(this.startTime)
          .toLocaleString('sv', {
            timeZone: timezone,
            dateStyle: 'short',
            timeStyle: 'short'
          })
          .replace(/-/g, '/')
          .replace(' ', ', ')
      : null;
  }
}
