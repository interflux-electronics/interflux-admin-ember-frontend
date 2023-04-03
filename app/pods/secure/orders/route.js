import BaseRoute from 'interflux/pods/base/route';

export default class OrdersRoute extends BaseRoute {
  needs = ['read_orders'];
}
