import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class SessionRoute extends ModalRoute {
  model(params) {
    return hash({
      session: this.store.findRecord('session', params.id, {
        // include: [
        //   'country_languages',
        //   'country_languages.language'
        //   // 'company_members',
        //   // 'company_markets',
        //   // 'company_members.person',
        //   // 'company_markets.country'
        // ].join(',')
      })
    });
  }
}
