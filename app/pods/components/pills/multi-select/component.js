import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PillsComponent extends Component {
  get classes() {
    return ['pills', this.layout].join(' ');
  }

  get layout() {
    return ['horizontal', 'vertical'].includes(this.args.layout)
      ? this.args.layout
      : 'vertical';
  }

  get options() {
    return this.args.options.map((option) => {
      const { label, value } = option;
      const isSelected = this.args.selectedOptions?.some(
        (selected) => selected.value === option.value
      );
      return { label, value, isSelected };
    });
  }

  @action onSelect(option) {
    const selected = this.args.selectedOptions || [];
    const isAlreadySelected = selected.some((s) => s.value === option.value);
    if (isAlreadySelected) {
      // Remove option from list
      const newList = selected.filter((s) => s.value !== option.value);
      this.args.onSelect(newList);
    } else {
      // Add option to list
      selected.push(option);
      this.args.onSelect(selected);
    }
  }
}
