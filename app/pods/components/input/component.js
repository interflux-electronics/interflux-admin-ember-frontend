import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class InputComponent extends Component {
  @tracked focus = false;
  @tracked hover = false;

  get classes() {
    return [
      this.args.theme || 'primary',
      this.args.state || 'no-state',
      this.hover ? 'hover' : 'no-hover',
      this.focus ? 'focus' : 'no-focus'
    ].join(' ');
  }

  get type() {
    return this.args.type || 'text';
  }

  @action
  selectText(input) {
    input.select();
  }

  // EVENTS

  @action
  onFocus(event) {
    this.focus = true;

    this.selectText(event.target);

    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
  }

  @action
  onBlur(event) {
    this.focus = false;

    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  @action
  onMouseOver(event) {
    this.hover = true;

    if (this.args.onMouseOver) {
      this.args.onMouseOver(event);
    }
  }

  @action
  onMouseOut(event) {
    this.hover = false;

    if (this.args.onMouseOut) {
      this.args.onMouseOut(event);
    }
  }

  @action
  onKeyDown(event) {
    if (this.args.onKeyDown) {
      this.args.onKeyDown(event);
    }
  }

  @action
  onKeyUp(event) {
    if (this.args.onKeyUp) {
      this.args.onKeyUp(event);
    }
  }
}
