import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ListComponent extends Component {
  @tracked query;
  @tracked options;
  @tracked count;
  @tracked max;

  constructor() {
    super(...arguments);

    const n = this.args.options ? this.args.options.length : 0;

    this.options = this.args.options.sortBy(this.args.label);
    this.count = n;
    this.max = n;
  }

  @action
  onKeyUp(event) {
    // console.debug('<FilterList> onKeyUp()', event.target.value);
    const query = event.target.value;
    this.query = query;
    if (!query) {
      this.options = this.args.options;
      this.count = this.max;
      return;
    }
    // TODO: delay the rendering for it can be slow
    const optionsFiltered = this.args.options.filter(option => {
      return option[this.args.label]
        .toLowerCase()
        .includes(this.query.toLowerCase());
    });
    this.options = optionsFiltered.sortBy(this.args.label);
    this.count = optionsFiltered.length;
  }

  @action
  layout() {
    console.debug('layout');
  }

  @action
  sort() {
    console.debug('sort');
  }
}
