import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

// <ListView
//   @title='Images'
//   @records={{this.records}}
//   @config={{this.config}}
//   @filters={{this.filters}}
//   @buttons={{this.buttons}}
//   @layouts={{array 'grid' 'list'}}
//   @onFilter={{this.onFilter}}
//   @onClickRecord={{this.onClickRecord}}
//   @onClickButton={{this.onClickButton}}
// />

export default class ListViewComponent extends Component {
  constructor() {
    super(...arguments);
    this.layout = this.args.layouts[0];
  }

  @tracked layout;

  get showTable() {
    return this.layout === 'table';
  }

  get showList() {
    return this.layout === 'list';
  }

  get showGrid() {
    return this.layout === 'grid';
  }

  get records() {
    let records = this.args.records;

    this.args.filters.forEach((filter) => {
      if (filter.type === 'search' && filter.value) {
        records = records.filter((record) => {
          return this.args.config.labels.some((label) => {
            const value = record.get(label.property);
            const search = filter.value;

            return value && value.toLowerCase().includes(search.toLowerCase());
          });
        });
      }

      if (filter.type === 'options') {
        records = records.filterBy(filter.property, filter.value);
      }
    });

    return records;
  }

  get search() {
    return this.args.filters.find((f) => f.type === 'search');
  }

  @action
  onInsertSearch(input) {
    input.value = this.search.value;
  }

  @action
  selectText(event) {
    const input = event.target;
    input.select();
  }

  @action
  onSearchKeyUp(event) {
    const input = event.target;
    const searchHasChanged = input.value !== this.search.value;

    // Pressing SHIFT or ARROW UP for example should not trigger a search
    if (searchHasChanged) {
      this.onFilter(this.search, input.value);
    }
  }

  @action
  onFilter(filter, value) {
    const { type } = filter;
    const queryParams = {};

    if (type === 'search') {
      queryParams['search'] = value;
    }

    if (type === 'options') {
      if (filter.value === value) {
        queryParams[filter.property] = null;
      } else {
        queryParams[filter.property] = value;
      }
    }

    if (type === 'checkboxes') {
      const arr = this[filter.property].split(',');

      queryParams[filter.property] = arr.includes(value)
        ? arr.filter((x) => x !== value).join(',')
        : [...arr, value].join(',');
    }

    this.router.transitionTo({ queryParams });
  }

  @service router;

  // SORT

  // @tracked sortBy;
  // @tracked sortUp = true;

  // get sortedRecords() {
  //   const arr = this.args.records.rejectBy('isNew').sortBy(this.sortBy);
  //   const isBlank = (x) => {
  //     return x[this.sortBy] === null || x[this.sortBy] === undefined;
  //   };
  //   const blanks = arr.filter(isBlank);
  //   const values = arr.reject(isBlank);
  //   const records = [...values, ...blanks];

  //   if (this.sortUp) {
  //     return records;
  //   } else {
  //     return records.reverse();
  //   }
  // }

  // @action
  // setSortBy(key) {
  //   if (this.sortBy === key) {
  //     this.sortUp = !this.sortUp;
  //   } else {
  //     this.sortBy = key;
  //     this.sortUp = true;
  //   }

  //   // Always reset the highlight or it may jump down the list
  //   this.highlighted = null;
  // }
}
