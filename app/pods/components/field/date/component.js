import FieldComponent from '../component';
import { action } from '@ember/object';

export default class FieldDateComponent extends FieldComponent {
  constructor() {
    super(...arguments);

    const { record, attribute } = this.args;
    const value = record.get(attribute);

    this.lastSavedValue = value || null;

    if (value === undefined) {
      console.warn(`${attribute} is not an attribute on the model`);
    }
  }

  get value() {
    return this.args.record.get(this.args.attribute);
  }

  set value(value) {
    this.args.record.set(this.args.attribute, value);
  }

  // The <input type="datetime-local"> only accepts "yyyy-MM-ddThh:mm" format.
  get dateString() {
    const unix = this.value;
    console.log('dateString()', unix);
    const str = new Date(unix)
      .toLocaleString('sv', {
        timeZone: 'UTC',
        dateStyle: 'short',
        timeStyle: 'short'
      })
      .replace(' ', 'T');
    console.log('dateString()', str);
    return str;
  }

  // The <input type="datetime-local"> returns times in "yyyy-MM-ddThh:mm" format.
  // Also, we need to convert this to UTC time.
  @action
  onChange(event) {
    console.log('onChange');
    const dateString = event.target.value;
    console.log('onChange()', dateString);
    const date = dateString.split('T')[0].split('-');
    const time = dateString.split('T')[1].split(':');
    const yyyy = date[0];
    const MM = Number(date[1]) - 1;
    const dd = date[2];
    const hh = time[0];
    const mm = time[1];
    const unix = Date.UTC(yyyy, MM, dd, hh, mm, 0);
    this.value = unix;
    console.log('onChange()', unix);
    this.save();
  }
}
