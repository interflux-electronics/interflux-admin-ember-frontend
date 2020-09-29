import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

// Usage:
// <Field::BelongsTo
//   @label="Country"
//   @record={{company}}
//   @relation='country'
//   @filterOn="nameEnglish"
//
//   @theme="primary"
//   @autofocus="true"
//   @disabled="true"
//   @placholder="Search me"
// />

export default class BelongsToRelationFieldComponent extends Component {
  @service form;
  @service store;

  id; // Unique across the app

  constructor() {
    super(...arguments);
    const id = this.form.getUniqueId();
    this.id = `field-${id}`;
  }

  // FOCUS

  @tracked hasFocus = false;

  @action
  onFocus() {
    this.hasFocus = true;
  }

  @action
  onBlur() {
    this.hasFocus = false;
  }

  // SEARCHING

  @tracked recordsForQuery;
  @tracked isSearching;

  mostRecentQuery;

  @action
  async onSearch(query) {
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
    this.isSearching = true;
    const model = this.args.relation;
    const response = await this.store.query(model, {
      filter: { nameEnglish: `${query}*` }
    });

    // Here we sort results that start with the query to the top and the rest below.
    // Both groups are sorted alphabetically before being merged into one array.
    const { filterOn } = this.args;
    const condition = (record) => {
      return record[filterOn].toLowerCase().startsWith(query.toLowerCase());
    };
    const arr1 = response.filter(condition).sortBy(filterOn);
    const arr2 = response.reject(condition).sortBy(filterOn);
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

  get currentRecord() {
    return this.args.record.get(this.args.relation);
  }

  @action
  onSelect(newRelation) {
    console.debug('selected', newRelation[this.args.filterOn]);
    this.args.record.set(this.args.relation, newRelation);
    console.debug('saving');
    this.args.record.save();
  }

  // SAVING

  // @tracked changes;

  // Is true when this attribute has unsaved changes (aka dirty)
  // get isDirty() {
  //   // It's important to create const out of these values so they trigger the recomputations
  //   const { value } = this;
  //   const { record, attribute } = this.args;
  //   const change = record.changedAttributes()[attribute];
  //   if (!change || !record.hasDirtyAttributes) {
  //     return false;
  //   }
  //   const lastSavedValue = change[0];
  //   return value !== lastSavedValue;
  // }

  // get isValid() {
  //   return true;
  // }

  // get showSave() {
  //   return this.isValid && this.isDirty;
  // }

  // get isSaving() {
  //   return this.args.record.isSaving;
  // }
}
