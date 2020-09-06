import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ButtonComponent extends Component {
  get classes() {
    return ['button', this.theme, this.icon].join(' ');
  }

  get theme() {
    return this.args.theme || 'primary';
  }

  get icon() {
    return this.args.icon || 'no-icon';
  }

  @action
  handleClick() {
    if (this.args.onClick) {
      this.args.onClick();
    }
  }
}
