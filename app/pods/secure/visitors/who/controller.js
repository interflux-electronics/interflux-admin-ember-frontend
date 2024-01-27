import Controller from '@ember/controller';

export default class VisitorsWhoController extends Controller {
  get websites() {
    return [
      'interflux.com',
      'interflux.group',
      'interflux.de',
      'interflux.fr',
      'interflux.es',
      'lmpa-q.com',
      'jeftluxer.com'
    ];
  }

  get years() {
    return ['2023', '2024', '2025'];
  }
}
