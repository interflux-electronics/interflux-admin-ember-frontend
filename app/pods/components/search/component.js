import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SearchComponent extends Component {
  // @arg id
  // @arg theme
  // @arg placeholder
  // @arg autofocus
  // @arg disabled
  // @arg value
  // @arg state
  // @arg onFocus
  // @arg onBlur
  // @arg onKeyUp
  // @arg onSelect
  // @arg searchModel
  // @arg searchLabel
  // @arg searchFilter
  // @arg minKeyStrokes
  // @arg error

  @service store;
  @service api;

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
    const { value, searchFilter } = this.args;
    return value ? value.get(searchFilter) : null;
  }

  get recordCount() {
    const arr = this.recordsForQuery || [];
    return arr.length;
  }

  get showResults() {
    return this.value.length >= this.minKeyStrokes;
    // return !(this.value === this.recordValue || !this.value);
  }

  get keepTypingMessage() {
    if (!this.value) {
      return 'Type to search';
    }
    const n = this.minKeyStrokes - this.value.length;
    return `Type ${n} more character${n > 1 ? 's' : ''}`;
  }

  get minKeyStrokes() {
    return this.args.minKeyStrokes || 0;
  }

  get buttons() {
    const arr = [];
    const { rangeMin, rangeMax, highlight, recordsForQuery } = this;
    const { searchFilter, searchLabel } = this.args;

    if (!recordsForQuery) {
      return [];
    }

    recordsForQuery.forEach((record, i) => {
      arr.push({
        record,
        label: searchLabel ? record[searchLabel] : record[searchFilter],
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
  selectText() {
    this.input.select();
  }

  // FOCUS

  input; // The <input> element in the template

  @action
  onInsert(input) {
    // Remember the <input> element for later use
    this.input = input;

    // If @autofocus was passed down, set manual focus.
    // Why don't we use the native <input autofocus="true"> attribute? Because it triggers only once.
    // Each consecutive time the <input> is hidden and shown, no autofocus occurs. To cope, we do
    // this manually each time the <input> is inserted in the DOM.
    if (this.args.autofocus) {
      input.focus();
    }
  }

  @action
  onFocus() {
    this.focus = true;

    this.selectText();
    this.searchDatabase();

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

      // Hit API and search database for query
      this.searchDatabase();

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
  @tracked error = false;

  mostRecentQuery;

  @action
  async searchDatabase() {
    const query = this.input.value;

    if (query.length < this.minKeyStrokes) {
      return console.warn(`not enough key strokes for search "${query}"`);
    }

    console.debug('searching', query);

    const { searchModel, searchFilter } = this.args;

    // First we store the query for later use
    this.mostRecentQuery = query;

    // First we reset our previous search results
    this.recordsForQuery = null;
    this.error = false;

    // Show loadspinner
    this.isSearching = true;

    // Prepare filters
    // If no characters were typed, then fetch all records.
    // If minimum 1 character was typed, do a filtered search.
    const filter = {};
    if (query) {
      filter[searchFilter] = `${query}*`;
    }

    // Then we send the API request and wait
    const response = await this.store
      .query(searchModel, { filter })
      .catch((response) => {
        this.api.logError(response);
        this.error = true;
      });

    if (this.error) {
      return console.error('search went bad');
    }

    // Here we sort results that start with the query to the top and the rest below.
    // Both groups are sorted alphabetically before being merged into one array.
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
