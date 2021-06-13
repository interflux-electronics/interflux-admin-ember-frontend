import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BaseRoute extends Route {
  // These services are available in all routes which inherit BaseRoute.
  @service api;
  @service store;

  // Alias to avoid confusion with the header service.
  // The seo (headData) service is all about the <head>.
  // The header services is all about the <header>.
  get seo() {
    return this.headData;
  }

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

  @action
  error(response) {
    console.error(`error() on "${this.routeName}" route`);

    // Interpret and log the error to console.
    this.api.logError(response);

    // Returning true allows the error to bubble up the route tree which triggers the error
    // templates to show
    return true;
  }
}
