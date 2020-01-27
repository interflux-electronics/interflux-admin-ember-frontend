import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class DemoComponent extends Component {
  constructor() {
    super(...arguments);
    console.log('<Demo> options', this.args.options.mapBy('cdnPath'));
    console.log('<Demo> optionLabel', this.args.optionLabel);
    console.log('<Demo> onKeyDown', this.args.onKeyDown);
    console.log('<Demo> onChange', this.args.onChange);
  }

  @action
  onFocus(event) {
    console.debug('<Search> onFocus()', { event });
  }

  @action
  onBlur(event) {
    console.debug('<Search> onBlur()', { event });
  }

  @action
  onKeyDown(event) {
    console.debug('<Search> onKeyDown()', { event });
  }

  @action
  onChange(event) {
    console.debug('<Search> onChange()', { event });
    if (this.args.onChange) {
      this.args.onChange(event);
    }
  }
}
