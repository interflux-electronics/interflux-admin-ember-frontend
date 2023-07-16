import Component from '@glimmer/component';

export default class PageContentComponent extends Component {
  get classes() {
    return this.args.theme || 'blue';
  }
}
