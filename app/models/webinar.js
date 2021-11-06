import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class WebinarModel extends Model {
  @attr('string') title;
  @attr('string') topic;
  @attr('string') audience;
  @attr('string') url;
  @attr('boolean') public;

  // People

  @belongsTo('person') host;
  @hasMany('webinar-invitee') webinarInvitees;
  @hasMany('webinar-attendee') webinarAttendees;

  // Image

  @belongsTo('image') image;
  @attr('string') imagePath;
  @attr('string') imageVariations;
  @attr('string') imageAlt;
  @attr('string') imageCaption;

  // Video

  @belongsTo('video') video;
  // @attr('string') imagePath;
  // @attr('string') imageVariations;
  // @attr('string') imageAlt;
  // @attr('string') imageCaption;

  // Slide deck
  // @belongsTo('file') slides;
  @belongsTo('document') document;

  // Date and time

  @attr('number') startTime; // milliseconds since 1 January 1970
  @attr('number') duration; // minutes

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
