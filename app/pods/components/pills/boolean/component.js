import Component from '@glimmer/component';

export default class PillsComponent extends Component {
  get classes() {
    return ['pills', this.layout].join(' ');
  }

  get layout() {
    return ['horizontal', 'vertical'].includes(this.args.layout)
      ? this.args.layout
      : 'vertical';
  }
}
