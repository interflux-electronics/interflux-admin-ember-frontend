import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ListComponent extends Component {
  @tracked query = '';

  get count() {
    return this.options.length || 0;
  }

  get max() {
    return this.args.options.length || 0;
  }

  get options() {
    const filtered = this.args.options.filter(option => {
      // If no query is present, return all options
      if (!this.query) {
        return true;
      }
      // Return only the options that have the query in their label
      return option[this.args.label]
        .toLowerCase()
        .includes(this.query.toLowerCase());
    });

    // Sort the options alphabetically by their labels
    return filtered.sortBy(this.args.label);
  }
}
