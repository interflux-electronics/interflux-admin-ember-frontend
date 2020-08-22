import Route from '@ember/routing/route';

export default class HelpRoute extends Route {
  model(params, transition) {
    let backRoute = transition.from ? transition.from.name : 'index';
    return { backRoute };
  }
}
