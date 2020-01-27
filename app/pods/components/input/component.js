import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ReusablesInputComponent extends Component {
  @action
  onChange(event) {
    console.debug('<Input> onChange', { event });
    if (this.args.onChange) {
      this.args.onChange(event);
    }
  }

  @action
  onKeyDown(event) {
    console.debug('<Input> onKeyDown', { event });
    if (this.args.onKeyDown) {
      this.args.onKeyDown(event);
    }
  }

  @action
  onFocus(event) {
    console.debug('<Input> onFocus', { event });
    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
    // if (this.selectOnFocus === true) {
    //   // TODO: Find Ember way
    //   // event.target.select();
    // }
  }

  @action
  onBlur(event) {
    console.debug('<Input> onBlur', { event });
    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }
}
