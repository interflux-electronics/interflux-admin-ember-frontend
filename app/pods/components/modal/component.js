import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ModalComponent extends Component {
  @tracked parentRoute;

  @service router;

  constructor() {
    super(...arguments);

    this.parentRoute = this.router.currentRoute.parent.name;
  }
}
