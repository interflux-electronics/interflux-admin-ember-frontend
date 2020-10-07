import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SearchComponent extends Component {
  @service store;

  @tracked focus = false;
  @tracked hover = false;

  get classes() {
    return [
      this.args.theme || 'primary',
      this.args.state || 'no-state',
      this.hover ? 'hover' : 'no-hover',
      this.focus ? 'focus' : 'no-focus'
    ].join(' ');
  }

  @tracked _value = this.recordValue;

  get value() {
    return this._value || (this.focus ? '' : this.recordValue);
  }

  set value(str) {
    this._value = str;
  }

  get recordValue() {
    return this.args.value.get(this.args.searchFilter);
  }

  get recordCount() {
    const arr = this.recordsForQuery || [];
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
    const { rangeMin, rangeMax, highlight, recordsForQuery } = this;
    const { searchFilter } = this.args;

    if (!recordsForQuery) {
      return [];
    }

    recordsForQuery.forEach((record, i) => {
      arr.push({
        record,
        label: record[searchFilter],
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

  @action
  selectText(input) {
    input.select();
  }

  // FOCUS

  input; // The <input> element in the template

  @action
  onFocus(event) {
    this.focus = true;

    // Remember the <input> element for later, so we can remove focus
    this.input = event.target;

    this.selectText(event.target);

    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
  }

  @action
  onBlur(event) {
    this.focus = false;

    // Reset the user's search query to the current value on the record
    this.value = this.recordValue;

    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  // HOVER

  @action
  onMouseOver() {
    this.hover = true;
  }

  @action
  onMouseOut() {
    this.hover = false;
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
      const record = this.recordsForQuery[i];
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
      this.searchDatabase(value);

      // Reset highlighted record
      this.highlight = 0;
      this.rangeMin = 0;
    }

    if (this.args.onKeyUp) {
      this.args.onKeyUp(event);
    }
  }

  // SEARCHING

  @tracked isSearching;
  @tracked recordsForQuery;

  mostRecentQuery;

  @action
  async searchDatabase(query) {
    // First we store the query for later use
    this.mostRecentQuery = query;

    // First we reset our previous search results
    this.recordsForQuery = null;

    // Prevent empty queries from being requested (no use case)
    if (!query) {
      return console.warn('aborting search, no query');
    }

    console.debug('searching', query);

    // Then we send the API request and wait
    // TODO: catch and show server errors
    this.isSearching = true;
    const model = this.args.searchModel;
    const response = await this.store.query(model, {
      filter: { nameEnglish: `${query}*` }
    });

    // Here we sort results that start with the query to the top and the rest below.
    // Both groups are sorted alphabetically before being merged into one array.
    const { searchFilter } = this.args;
    const condition = (record) => {
      return record[searchFilter].toLowerCase().startsWith(query.toLowerCase());
    };
    const arr1 = response.filter(condition).sortBy(searchFilter);
    const arr2 = response.reject(condition).sortBy(searchFilter);
    const arr = [...arr1, ...arr2];

    // In case multiple request were sent by a user typing quickly, we are only interested in the
    // response of the most recent query.
    if (this.mostRecentQuery === query) {
      this.recordsForQuery = arr;
    } else {
      console.warn('dropping response for:', query);
    }

    // We add an intentional delay to allow the <Search> component to render the results before
    // ending the loading its loading state.
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.isSearching = false;
  }

  // SELECTING

  @tracked highlight = 0; // The index of the record currently highlighted

  @action
  select(record) {
    this.args.onSelect(record);
    this.input.blur();
  }
}
