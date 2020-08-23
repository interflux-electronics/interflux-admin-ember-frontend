import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class NavUserComponent extends Component {
  @service auth;

  get userFirstName() {
    return this.auth.user.person.get('firstName');
  }
}
