import ModalRoute from 'interflux/pods/components/modal/route';

export default class PermalinkRoute extends ModalRoute {
  model(params) {
    return {
      permalink: this.store.peekRecord('permalink', params.id)
    };
  }
}
