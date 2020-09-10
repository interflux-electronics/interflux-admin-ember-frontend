import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service auth;

  email = null;
  password = null;

  @action
  submit() {
    this.auth.getToken.perform(this.email, this.password);
  }

  get isBusy() {
    return this.auth.getToken.isRunning;
  }
}
