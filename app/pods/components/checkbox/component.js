import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CheckboxComponent extends Component {
  get classes() {
    return [this.args.checked ? 'checked' : 'not-checked'].join(' ');
  }

  input; // the <input> element

  @action
  onInsert(element) {
    this.input = element;
  }

  @action
  onClick() {
    this.args.onClick();
    this.input.blur();
  }

  @action
  onKeyDown(event) {
    const pressedEnter = event.code === 'Enter';
    const pressedSpace = event.code === 'Space';

    if (pressedSpace || pressedEnter) {
      event.preventDefault();
      this.args.onClick();
    }
  }
}
