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
    this.route('companies', function () {
      this.route('company', { path: '/:id' });
    });

    this.route('documents', function () {
      this.route('document', { path: '/:id' });
    });

    this.route('families', function () {
      this.route('create');
      this.route('family', { path: '/:id' });
    });

    this.route('qualities', function () {
      this.route('quality', { path: '/:id' });
    });

    this.route('uses', function () {
      this.route('use', { path: '/:id' });
    });

    this.route('images', function () {
      this.route('image', { path: '/:id' });
    });

    this.route('leads', function () {
      this.route('lead', { path: '/:id' });
    });

    this.route('orders', function () {
      this.route('order', { path: '/:id' });
    });

    this.route('people', function () {
      this.route('person', { path: '/:id' });
    });

    this.route('products', function () {
      this.route('product', { path: '/:id' });
    });

    this.route('videos', function () {
      this.route('video', { path: '/:id' });
    });

    this.route('webinars', function () {
      this.route('webinar', { path: '/:id' });
    });

    this.route('user', function () {
      this.route('download');
      this.route('issue');
      this.route('help');
      this.route('preferences');
    });
  });

  this.route('catchall', { path: '*:' });
});
