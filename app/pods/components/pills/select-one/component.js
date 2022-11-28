import Component from '@glimmer/component';

export default class PillsComponent extends Component {
  // @arg options
  // @arg optionLabel
  // @arg layout
  // @arg selected
  // @arg onSelect

  get classes() {
    return ['pills', this.layout].join(' ');
  }

  get layout() {
    return ['horizontal', 'vertical'].includes(this.args.layout)
      ? this.args.layout
      : 'vertical';
  }
}
