import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CheckboxComponent extends Component {
  @action
  toggle() {
    this.args.onToggle(!this.args.value);
  }
}
