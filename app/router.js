import EmberRouter from '@ember/routing/router';
import config from 'interflux/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('loading');

  this.route('secure', function () {
    this.route('products', function () {
      this.route('create');
      this.route('product', { path: '/:id' });
    });

    this.route('families', function () {
      this.route('create');
      this.route('family', { path: '/:id' });
    });

    this.route('qualities', function () {
      this.route('create');
      this.route('quality', { path: '/:id' });
    });

    this.route('uses', function () {
      this.route('create');
      this.route('use', { path: '/:id' });
    });

    this.route('documents', function () {
      this.route('create');
      this.route('document', { path: '/:id' });
    });

    this.route('companies', function () {
      this.route('create');
      this.route('company', { path: '/:id' });
    });

    this.route('people', function () {
      this.route('create');
      this.route('person', { path: '/:id' });
    });

    this.route('images', function () {
      this.route('create');
      this.route('image', { path: '/:id' });
    });

    this.route('videos', function () {
      this.route('video', { path: '/:id' });
    });

    this.route('translations', function () {
      this.route('translation', { path: '/:id' });
    });

    this.route('webinars', function () {
      this.route('create');
      this.route('webinar', { path: '/:id' });
    });

    this.route('events', function () {
      this.route('create');
      this.route('event', { path: '/:id' });
    });

    this.route('countries', function () {
      this.route('country', { path: '/:id' });
    });

    this.route('sessions', function () {
      this.route('session', { path: '/:id' });
    });

    this.route('permalinks', function () {
      this.route('create');
      this.route('permalink', { path: '/:id' });
    });

    this.route('user', function () {
      this.route('download');
      this.route('issue');
      this.route('help');
      this.route('preferences');
    });

    this.route('forbidden');
  });

  this.route('catchall', { path: '*:' });
});
