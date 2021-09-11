import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ErrorGenericComponent extends Component {
  @action
  openLiveChat() {
    window.LiveChatWidget.call('maximize');
  }
}
