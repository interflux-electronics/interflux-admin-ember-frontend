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
    if (!this.args.loading) {
      this.layout = this.args.layouts[0];
    }
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

    // Prevent records from appearing when on create route;
    records = records.rejectBy('isNew');

    // Iterate over all filters (search, options, checkboxes) and apply.
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

      if (filter.type === 'checkboxes') {
        const keepers = filter.value.split(',');
        records = records.filter((record) => {
          return keepers.some((v) => {
            return record.get(filter.property) === v;
          });
        });
      }
    });

    return records;
  }

  get recordCount() {
    return this.records.length.toString();
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
  onFilter(filter, newValue) {
    const { type } = filter;
    const queryParams = {};

    if (type === 'search') {
      queryParams['search'] = newValue;
    }

    if (type === 'options') {
      if (filter.value === newValue) {
        queryParams[filter.property] = null;
      } else {
        queryParams[filter.property] = newValue;
      }
    }

    if (type === 'checkboxes') {
      const arr = filter.value.split(',');
      const str = arr.includes(newValue)
        ? arr.filter((x) => x !== newValue).join(',')
        : [...arr, newValue].join(',');

      queryParams[filter.queryParam] = str;
    }

    this.router.transitionTo({ queryParams });
  }

  @service router;

  // Returns all filters + counters
  get filters() {
    return this.args.filters.map((f) => {
      const filter = Object.assign({}, f);

      if (filter.type === 'checkboxes') {
        filter.checkboxes = filter.checkboxes.map((c) => {
          const checkbox = Object.assign({}, c);
          const records = this.records.filter((record) => {
            return record
              .get(filter.property)
              .split(',')
              .includes(checkbox.value);
          });

          checkbox.count = checkbox.count || {};
          checkbox.count.label = records.length.toString();
          checkbox.checked = filter.value?.split(',').includes(checkbox.value);

          return checkbox;
        });

        return filter;
      }

      return filter;
    });
  }

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
