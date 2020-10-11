import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CheckboxComponent extends Component {
  get classes() {
    return [this.args.checked ? 'checked' : 'not-checked'].join(' ');
  }

  @action
  onClick() {
    this.args.onClick();
  }

  @action
  onKeyDown(event) {
    const pressedEnter = event.code === 'Enter';
    const pressedSpace = event.code === 'Space';

    if (pressedSpace || pressedEnter) {
      event.preventDefault();
      this.onClick();
    }
  }
}
