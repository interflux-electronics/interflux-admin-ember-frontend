import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class CompanyRoute extends ModalRoute {
  model(params) {
    return hash({
      company: this.store.findRecord('company', params.id, {
        include: [
          'country',
          'people',
          'markets',
          'company_members',
          'company_markets'
        ].join(','),
        reload: true
      })
    });
  }
}
