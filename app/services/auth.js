import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'interflux/config/environment';

export default class AuthService extends Service {
  @service store;
  @service router;

  @tracked uuid;
  @tracked token;
  @tracked expiry;
  @tracked user;

  remember(key, value) {
    this[key] = value;
    localStorage.setItem(key, value);
  }

  revive() {
    this.token = localStorage.getItem('token');
    this.expiry = localStorage.getItem('expiry');
    this.uuid = localStorage.getItem('uuid');
  }

  // Someone who is logged into admin.interflux.com ought to be also immediately logged into
  // interflux.com, our public facing website. This sync makes that possible.
  sync() {
    const onMessage = (event) => {
      console.log('ADMIN: onMessage', event.origin);

      if (event.origin === ENV.publicHost && event.data === 'sync-complete') {
        console.log('ADMIN: sync complete!');
        console.log('ADMIN: removing <iframe>');
        const iframe = document.querySelector(
          `iframe[src^="${ENV.publicHost}"]`
        );
        iframe.remove();
      }
    };

    window.addEventListener('message', onMessage, false);
    const fragment = document.createDocumentFragment();
    const iframe = document.createElement('iframe');
    iframe.src = `${ENV.publicHost}/assets/sync.html`;
    iframe.className = 'sync';
    iframe.onload = (event) => {
      console.log('ADMIN: iframe onload');
      const iframe = event.target;
      const { token, uuid, expiry } = this;
      const name = this.user.get('person.fullName');
      const email = this.user.email;
      const data = { token, uuid, expiry, name, email };
      const target = ENV.publicHost;
      console.log('ADMIN: posting to iframe', data, target);
      iframe.contentWindow.postMessage(data, target);
    };
    console.log('ADMIN: appending iframe');
    fragment.appendChild(iframe);
    document.body.appendChild(fragment);
  }

  @action
  reset() {
    this.token = null;
    this.user = null;
    this.expiry = null;
    localStorage.clear();
    this.sync();
    this.store.unloadAll();
    this.router.transitionTo('login');
  }
}
