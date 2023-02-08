import Model, { attr, belongsTo } from '@ember-data/model';

export default class EventModel extends Model {
  @attr('string') name;
  @attr('string') dates;
  @attr('string') startDate;
  @attr('string') endDate;
  @attr('string') city;
  @attr('string') description;

  @belongsTo('country') country;

  get datesCombined() {
    if (!this.startDate) {
      return null;
    }

    const startDate = this.startDate.split('-');
    const YYYY = startDate[0];
    const MM = Number(startDate[1]);
    const DD = Number(startDate[2]);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    const MMM = months[MM - 1];

    if (!this.endDate || this.endDate === this.startDate) {
      return `${DD} ${MMM} ${YYYY}`;
    }

    const endDate = this.endDate.split('-');
    const DD2 = Number(endDate[2]);
    const MM2 = Number(endDate[1]);

    if (MM === MM2) {
      return `${DD} – ${DD2} ${MMM} ${YYYY}`;
    }

    const MMM2 = months[MM2 - 1];

    return `${DD} ${MMM} – ${DD2} ${MMM2} ${YYYY}`;
  }

  get hasEnded() {
    if (!this.startDate) {
      return true;
    }

    const referenceDate = this.endDate || this.startDate;
    const split = referenceDate.split('-');
    const YYYY = split[0];
    const MM = Number(split[1]);
    const DD = Number(split[2]);
    const date = new Date(YYYY, MM - 1, DD + 1); // DD also +1 because timezones
    const now = new Date();

    return date < now;
  }
}
