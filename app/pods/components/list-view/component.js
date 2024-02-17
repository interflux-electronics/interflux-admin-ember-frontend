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
//   @sortBy='name'
//   @sortAscending={{true}}
//   @onFilter={{this.onFilter}}
//   @onClickRecord={{this.onClickRecord}}
//   @onClickButton={{this.onClickButton}}
// />

export default class ListViewComponent extends Component {
  constructor() {
    super(...arguments);

    // On the loading routes, we render the <ListView @loading="true">.
    // Do nothing when loading.
    if (this.args.loading) {
      return;
    }

    // On page load, always show the frist layout in the list.
    // If no layouts are passed down, assume the table layout.
    if (this.args.layouts) {
      this.layout = this.args.layouts[0];
    } else {
      this.layout === 'table';
    }

    // If @sortBy is not passed in, then assume sorting by the first column.
    if (this.args.sortBy) {
      this.sortBy = this.args.sortBy;
    } else {
      this.sortBy = this.args.config.labels[0].property;
    }

    // If @sortAscending is not passed in, then assume sorting ascending (alphabetically).
    if (this.args.sortAscending) {
      this.sortAscending = this.args.sortAscending;
    } else {
      this.sortAscending = true;
    }
  }

  @tracked layout;

  get layouts() {
    return this.args.layouts.map((l) => {
      return {
        name: l,
        selected: this.layout === l
      };
    });
  }

  get showTable() {
    return this.layout === 'table';
  }

  get showList() {
    return this.layout === 'list';
  }

  get showGrid() {
    return this.layout === 'grid';
  }

  get filteredRecords() {
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

      if (filter.type === 'options' && filter.value !== 'all') {
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
    return this.filteredRecords.length.toString();
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

  @tracked sortBy;
  @tracked sortAscending = true;

  // Sort the filtered records.
  get sortedRecords() {
    // Only show the filtered records
    let records = this.filteredRecords;

    // Only show records which are not currently being created.
    records = records.rejectBy('isNew');

    // Sort by chosen key
    records = records.sortBy(this.sortBy);

    // Reverse the order if needed
    if (this.sortAscending === false) {
      records = records.reverse();
    }

    // Make sure empty values appear at the end of the list.
    // const isBlank = (x) => {
    //   return x[this.sortBy] === null || x[this.sortBy] === undefined;
    // };
    // const blanks = arr.filter(isBlank);
    // const values = arr.reject(isBlank);
    // const records = [...values, ...blanks];

    return records;
  }

  // COLUMNS

  get columns() {
    return this.args.config.labels.map((l) => {
      const { label, property } = l;
      const sorted = this.sortBy === property;

      return { label, property, sorted };
    });
  }

  @action
  onClickColumnHead(column) {
    const key = column.property;

    // When user clicks column which is already the sorted column, then reverse the sort order.
    // When user clicks columns which are not sorted, then sort that column ascending.
    if (this.sortBy === key) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortBy = key;
      this.sortAscending = true;
    }
  }
}
