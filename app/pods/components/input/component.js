import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Input extends Component {
  @tracked value;

  @action
  onFocus(event) {
    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
    // Select all text inside the <input> on focus
    event.target.select();
  }

  @action
  onBlur(event) {
    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  @action
  onKeyUp(event) {
    this.value = event.target.value;
    if (this.args.onKeyUp) {
      this.args.onKeyUp(event);
    }
  }
}
