import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class VisitorsWhoController extends Controller {
  @tracked host = 'interflux.com';
  @tracked year = '2024';

  get hosts() {
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
    return ['2024'];
  }

  get visitorSummary() {
    return this.model.visitorSummaries
      .filterBy('host', this.host)
      .findBy('year', this.year);
  }

  get host() {
    return this.visitorSummary.host;
  }

  get year() {
    return this.visitorSummary.year;
  }

  get data() {
    return this.visitorSummary.data;
  }

  get customerColumns() {
    return [
      { label: 'Country', key: 'label', showFlag: true },
      { label: 'Visits', key: 'total' },
      { label: 'Ratio', key: 'ratio' }
    ];
  }

  get interfluxColumns() {
    return [
      { label: 'Company', key: 'label', showFlag: true },
      { label: 'Visits', key: 'total' },
      { label: 'Ratio', key: 'ratio' }
    ];
  }

  get robotColumns() {
    return [
      { label: 'Name', key: 'label', showFlag: true },
      { label: 'Visits', key: 'total' },
      { label: 'Ratio', key: 'ratio' }
    ];
  }

  get totalCustomers() {
    return this.data.customers.perMonth
      .map((rec) => rec.total)
      .reduce((a, b) => a + b, 0);
  }
}
