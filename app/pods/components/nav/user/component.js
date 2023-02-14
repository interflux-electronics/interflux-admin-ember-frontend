import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class NavUserComponent extends Component {
  @service auth;

  get userFirstName() {
    return this.auth.user?.person?.get('firstName') || 'Human';
  }

  openLiveChat() {
    window.LiveChatWidget.call('maximize');
  }
}
