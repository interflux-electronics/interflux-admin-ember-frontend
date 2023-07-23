import Service from '@ember/service';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
// import ENV from 'interflux/config/environment';

export default class AuthService extends Service {
  @service store;
  @service router;

  // The authenticate user record.
  // This user will match the one stored in the HTTP-only cookie.
  @tracked user;

  @action
  reset(doTransition = true) {
    console.warn('unloading Ember Data store');
    this.store.unloadAll();

    if (doTransition) {
      console.warn('redirecting user to login');
      this.router.transitionTo('login');
    }
  }
}
