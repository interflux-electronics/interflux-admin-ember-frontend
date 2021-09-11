import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CheckboxComponent extends Component {
  @action
  onClick() {
    if (this.args.disabled) {
      return true;
    }

    this.args.onClick();
  }

  @action
  onKeyDown(event) {
    if (this.args.disabled) {
      return true;
    }

    const pressedEnter = event.code === 'Enter';
    const pressedSpace = event.code === 'Space';

    if (pressedSpace || pressedEnter) {
      event.preventDefault();
      this.args.onClick();
    }
  }
}
