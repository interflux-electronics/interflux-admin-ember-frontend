import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ButtonComponent extends Component {
  get classes() {
    return ['button', this.theme, this.icon, this.text, this.isBusy].join(' ');
  }

  get theme() {
    return this.args.theme || 'no-theme';
  }

  get icon() {
    return this.args.icon || 'no-icon';
  }

  get text() {
    return this.args.text ? 'has-text' : 'no-text';
  }

  get isBusy() {
    return this.args.isBusy ? 'busy' : 'idle';
  }

  @action
  onClick(event) {
    if (this.args.onClick && !this.args.isBusy) {
      this.args.onClick(event);
    }
  }

  @action
  onFocus(event) {
    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
  }

  @action
  onBlur(event) {
    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  @action
  onMouseDown(event) {
    if (this.args.onMouseDown) {
      this.args.onMouseDown(event);
    }
  }

  @action
  onMouseUp(event) {
    if (this.args.onMouseUp) {
      this.args.onMouseUp(event);
    }
  }
}
