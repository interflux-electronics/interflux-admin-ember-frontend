import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ListComponent extends Component {
  @tracked query;
  @tracked options;

  constructor() {
    super(...arguments);

    // Make the passed-down options local
    this.options = this.args.options;
  }

  @action
  onKeyUp(event) {
    // console.debug('<List> onKeyUp()', event.target.value);
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
  }
}
