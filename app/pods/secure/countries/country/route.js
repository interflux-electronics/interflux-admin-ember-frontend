import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class CompanyRoute extends ModalRoute {
  model(params) {
    return hash({
      country: this.store.findRecord('country', params.id, {
        include: [
          'country_languages',
          'country_languages.language'
          // 'company_members',
          // 'company_markets',
          // 'company_members.person',
          // 'company_markets.country'
        ].join(',')
      })
    });
  }
}
