import Component from '@glimmer/component';

export default class ButtonComponent extends Component {
  handleClick() {
    if (this.args.onClick) {
      this.args.onClick();
    }
  }
}
