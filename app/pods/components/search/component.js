import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchComponent extends Component {
  @tracked hasFocus = false;
  @tracked hasHover = false;
  @tracked highlight = 0; // The index of the record currently highlighted

  get classes() {
    return [
      this.args.theme || 'primary',
      this.hasFocus ? 'focus' : 'no-focus',
      this.hasHover ? 'hover' : 'no-hover'
    ].join(' ');
  }

  @tracked _value = this.recordValue;

  get value() {
    return this._value || (this.hasFocus ? '' : this.recordValue);
  }

  set value(str) {
    this._value = str;
  }

  get recordValue() {
    return this.args.currentRecord.get(this.args.filterOn);
  }

  get recordCount() {
    const arr = this.args.recordsForQuery || [];
    return arr.length;
  }

  get showPleaseType() {
    return this.value === this.recordValue || !this.value;
  }

  get showResults() {
    return !this.showPleaseType;
  }

  get buttons() {
    const arr = [];
    const { rangeMin, rangeMax, highlight } = this;
    const { filterOn, recordsForQuery } = this.args;

    if (!recordsForQuery) {
      return [];
    }

    recordsForQuery.forEach((record, i) => {
      arr.push({
        record,
        label: record[filterOn],
        classes: i === highlight ? 'highlight' : 'idle',
        shown: i >= rangeMin && i < rangeMax
      });
    });

    return arr;
  }

  _rangeMin = 0;

  set rangeMin(value) {
    this._rangeMin = value;
  }

  get rangeMin() {
    const i = this.highlight;
    const min = this._rangeMin;
    const max = min + 5;

    if (i < min) {
      this._rangeMin = i;
    }

    if (i > max) {
      this._rangeMin = i - 5;
    }

    return this._rangeMin;
  }

  get rangeMax() {
    return this.rangeMin + 6;
  }

  // FOCUS

  input; // The <input> element in the template

  @action
  onFocus(event) {
    this.hasFocus = true;

    // Remember the <input> element for later, so we can remove focus
    this.input = event.target;

    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
  }

  @action
  onBlur(event) {
    this.hasFocus = false;

    // Reset the user's search query to the current value on the record
    this.value = this.recordValue;

    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  // HOVER

  @action
  onMouseOver() {
    this.hasHover = true;
  }

  @action
  onMouseOut() {
    this.hasHover = false;
  }

  @action
  onMouseOverButton(i) {
    if (this.highlight != i) {
      this.highlight = i;
    }
  }

  @action
  onMouseDown(record) {
    this.select(record);
  }

  // KEY STROKES

  @action
  onKeyDown(event) {
    // On arrow down, highlight the next record
    if ('ArrowDown' === event.key) {
      const n = this.recordCount;
      const i = this.highlight;
      let ii = i + 1;
      if (ii >= n) {
        ii = 0;
      }
      this.highlight = ii;
    }

    // On arrow up, highlight the previous record
    if ('ArrowUp' === event.key) {
      const n = this.recordCount;
      const i = this.highlight;
      let ii = i - 1;
      if (ii < 0) {
        ii = n - 1;
      }
      this.highlight = ii;
    }

    if ('Enter' === event.key) {
      const i = this.highlight;
      const record = this.args.recordsForQuery[i];
      this.select(record);
    }
  }

  @action
  onKeyUp(event) {
    const input = event.target;
    const value = input.value;
    const valueHasChanged = value !== this.value;

    // Only update, search and reset highlight if the value has changed.
    // This prevents key presses like "Enter" and arrow keys from triggering searches.
    if (valueHasChanged) {
      // Update local value
      this.value = value;

      // Send search event to parent component
      this.args.onSearch(value);

      // Reset highlighted record
      this.highlight = 0;
      this.rangeMin = 0;
    }
  }

  // SELECTING

  @action
  select(record) {
    this.args.onSelect(record);
    this.input.blur();
  }
}
