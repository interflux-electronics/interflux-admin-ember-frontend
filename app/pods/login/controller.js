import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service auth;

  email;
  password;

  @action
  submit() {
    this.auth.getToken.perform(this.email, this.password);
  }

  get isBusy() {
    return this.auth.getToken.isRunning;
  }

  @action
  onKeyDown(event) {
    if (event.code === 'Enter') {
      this.submit();
    }
  }

  @action
  onKeyUp(event) {
    const input = event.target;
    const key = input.id.replace('input-', '');
    const value = input.value;

    this[key] = value;
  }
}
