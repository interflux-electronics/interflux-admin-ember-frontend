import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ModalComponent extends Component {
  @service router;

  get parentRoute() {
    return this.router.currentRouteName.split('.').slice(0, -1).join('.');
  }
}
