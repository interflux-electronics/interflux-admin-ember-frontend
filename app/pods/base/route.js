import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class BaseRoute extends Route {
  // These services are available in all routes which inherit BaseRoute.
  @service auth;
  @service api;
  @service store;
  @service router;

  get isNode() {
    return this.fastboot.isFastBoot;
  }

  // This initializer makes sure each route transition resets the scroll position
  // of the viewport to the top. Override ad hoc per route to prevent this behaviour.
  resetScroll = true;

  activate() {
    super.activate();
    if (this.resetScroll) {
      window.scrollTo(0, 0);
    }
  }

  // Not all users are able to see all of the resources on the left hand side of Admin.
  // This bit of logic prevents users from seeing routes for which they are not authorised.
  beforeModel() {
    super.activate();

    if (!this.needs) {
      return;
    }

    const allowed = this.needs.every((ability) => {
      return this.auth.user.can(ability);
    });

    if (!allowed) {
      console.warn(`user is not allowed`);
      this.router.transitionTo('secure.forbidden');
    }
  }

  @action
  error(response) {
    console.error(`error() on "${this.routeName}" route`);

    // Interpret and log the error to console.
    this.api.logError(response);

    // Returning true allows the error to bubble up the route tree which triggers the error
    // templates to show
    return false;
  }
}
