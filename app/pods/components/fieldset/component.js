import Component from '@glimmer/component';

export default class FieldsetComponent extends Component {
  get classes() {
    return [
      this.args.id || 'no-id',
      this.args.theme || 'primary',
      this.args.state || 'no-state',
      this.args.hasFocus ? 'focus' : 'no-focus'
    ].join(' ');
  }
}
