import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ToggleComponent extends Component {
  @action
  toggle() {
    this.args.onToggle(!this.args.value);
  }

  @action
  set(value) {
    if (this.args.value === value) {
      return;
    }
    this.args.onToggle(value);
  }
}
