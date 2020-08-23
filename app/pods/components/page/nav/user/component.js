import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PageNavUserComponent extends Component {
  @service auth;

  get userFirstName() {
    return this.auth.user.person.firstName;
  }
}
