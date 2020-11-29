import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AuthService extends Service {
  @service store;
  @service router;

  @tracked token;
  @tracked user;
  @tracked uuid;
  @tracked expiry;

  remember(key, value) {
    this[key] = value;
    localStorage.setItem(key, value);
  }

  revive() {
    this.token = localStorage.getItem('token');
    this.expiry = localStorage.getItem('expiry');
    this.uuid = localStorage.getItem('uuid');
  }

  @action
  reset() {
    this.token = null;
    this.user = null;
    this.expiry = null;
    localStorage.clear();
    this.store.unloadAll();
    this.router.transitionTo('login');
  }
}
