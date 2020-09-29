import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TextareaComponent extends Component {
  @tracked hasFocus = false;
  @tracked hasHover = false;

  get classes() {
    return [
      this.args.theme || 'no-theme',
      this.hasFocus ? 'focus' : 'no-focus',
      this.hasHover ? 'hover' : 'no-hover'
    ].join(' ');
  }

  // EVENTS

  @action
  onFocus(event) {
    this.hasFocus = true;

    event.target.select();

    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
  }

  @action
  onBlur(event) {
    this.hasFocus = false;

    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  @action
  onMouseOver(event) {
    this.hasHover = true;

    if (this.args.onMouseOver) {
      this.args.onMouseOver(event);
    }
  }

  @action
  onMouseOut(event) {
    this.hasHover = false;

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
