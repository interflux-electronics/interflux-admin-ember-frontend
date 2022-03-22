import Model, { attr, belongsTo } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class SessionModel extends Model {
  @attr('string') href;
  @attr('string') referrer;

  @attr('string') ip;
  @attr('string') ipTimeZone;
  @attr('string') ipIsp;
  @attr('string') ipResponseCode;
  @attr('string') ipResponseBody;
  @attr('string') ipRequestDuration;
  @attr('string') ipCountryId;

  @attr('string') browserApp;
  @attr('string') browserWidth;
  @attr('string') browserHeight;
  @attr('string') browserLanguages;

  @attr('boolean') isInterfluxMember;

  @attr('date') createdAt;

  @belongsTo('user') user;

  get createdAtUTC() {
    return this.formatDate('UTC');
  }

  formatDate(timezone) {
    return this.createdAt
      ? new Date(this.createdAt)
          .toLocaleString('sv', {
            timeZone: timezone,
            dateStyle: 'short',
            timeStyle: 'short'
          })
          .replace(/-/g, '/')
          .replace(' ', ', ')
      : null;
  }

  get timeFromNow() {
    const ms = new Date().getTime() - new Date(this.createdAt).getTime();
    const sec = ms / 1000;
    const min = sec / 60;
    const hours = min / 60;
    // const days = hours / 24;

    return Math.floor(hours);

    // return days;
    // if (days === 0) {
    //   return 'today';
    // }
    //
    // if (days === 1) {
    //   return 'yesterday';
    // }
    //
    // return `${days} days ago`;
  }

  get isp() {
    return this.ipIsp || 'N/A';
  }

  get ipCountryFlag() {
    return `${ENV.cdnHost}/images/public/flags/${this.ipCountryId}.svg`;
  }

  get ipCountryName() {
    return this.store.peekRecord('country', this.ipCountryId).nameEnglish;
  }
}
