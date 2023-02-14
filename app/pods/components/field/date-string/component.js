import FieldComponent from '../component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FieldDateStringComponent extends FieldComponent {
  constructor() {
    super(...arguments);
    this.lastSavedValue = this.value;
  }

  get value() {
    return this.args.record.get(this.args.attribute);
  }

  set value(value) {
    this.args.record.set(this.args.attribute, value);
  }

  @tracked YYYY = null;
  @tracked MM = null;
  @tracked DD = null;

  // Set the initial value of the <input> elements
  @action onInsert(input) {
    const date = this.value;

    if (!date) {
      return; // do nothing
    }

    if (!date.match(/^\d{4}-\d{2}-\d{2}$/g)) {
      console.warn('invalid date passed in...');
      console.warn(this.value);
      return; // do nothing
    }

    const key = input.className; // YYYY | MM | DD | hh | mm
    const split = date.split('-');

    if (key === 'YYYY') {
      this.YYYY = split[0];
      input.value = split[0];
    }

    if (key === 'MM') {
      this.MM = split[1];
      input.value = split[1];
    }

    if (key === 'DD') {
      this.DD = split[2];
      input.value = split[2];
    }
  }

  @action onKeyDown(event) {
    const { key, target } = event;

    if (key === 'Tab' || key === 'Backspace') {
      return true;
    }
    if (key.match(/\d/g) && target.value.length < target.maxLength) {
      return true;
    }
    if (key.match(/\d/g) && getSelection()) {
      return true;
    }
    return false;
  }

  @action onKeyUp(event) {
    const input = event.target;
    const key = event.target.className; // YYYY | MM | DD | hh | mm
    this[key] = input.value;
    this.validateAndSave();
  }

  validateAndSave() {
    const { lastSavedValue } = this;
    const YYYY = this.YYYY && this.YYYY.length === 4 ? this.YYYY : null;
    const regex = /^[1-9]{1}$/g;
    const MM = this.MM && this.MM.match(regex) ? `0${this.MM}` : this.MM; // add leading zeros to single digits
    const DD = this.DD && this.DD.match(regex) ? `0${this.DD}` : this.DD; // add leading zeros to single digits
    const date = new Date(`${YYYY}-${MM}-${DD}T00:00:00.000+00:00`);
    const unix = date.valueOf();

    if (!YYYY || !MM || !DD) {
      console.warn('incomplete date');
      this.error = null;
      this.value = null;
      if (lastSavedValue !== null) {
        this.save();
      }
    } else if (isNaN(unix)) {
      console.error('invalid date');
      this.error = 'Invalid date';
      this.value = null;
    } else {
      console.debug(`${YYYY}-${MM}-${DD}`);
      this.error = null;
      this.value = `${YYYY}-${MM}-${DD}`;
      this.save();
    }
  }

  @action onFocus(event) {
    this.hasFocus = true;
    event.target.select();
  }
}
