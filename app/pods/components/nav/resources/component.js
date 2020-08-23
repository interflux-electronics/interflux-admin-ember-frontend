import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NavResourcesComponent extends Component {
  @service auth;

  @tracked expanded = true;

  handleInsert() {
    console.log('inserted <nav>');
  }

  get navClass() {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  @action
  handleHamburgerClick(event) {
    this.expanded = !this.expanded;
    console.log(event.currentTarget);
  }
}
