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
    const value = event.target.value;
    const valueChanged = value !== this.value;
    if (valueChanged) {
      // Update local value
      this.value = value;

      // Fire up event
      if (this.args.onChange) {
        this.args.onChange(value);
      }
    }

    if (event.key === 'Enter') {
      if (this.args.onEnter) {
        this.args.onEnter(event);
      }
    }

    // JW: Use case?
    // if (this.args.onKeyUp) {
    //   this.args.onKeyUp(event);
    // }
  }
}
