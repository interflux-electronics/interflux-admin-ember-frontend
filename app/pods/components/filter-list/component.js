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

    // Make the passed-down options local
    this.options = this.args.options;
    this.count = this.args.options.length;
    this.max = this.args.options.length;
  }

  @action
  onKeyUp(event) {
    // console.debug('<FilterList> onKeyUp()', event.target.value);
    const query = event.target.value;
    this.query = query;
    if (!query) {
      return (this.options = this.args.options);
    }
    // TODO: delay the rendering for it can be slow
    const optionsFiltered = this.args.options.filter(option => {
      return option[this.args.label].includes(this.query);
    });
    this.options = optionsFiltered;
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
