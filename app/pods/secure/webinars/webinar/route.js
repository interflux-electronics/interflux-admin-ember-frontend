import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class WebinarRoute extends ModalRoute {
  model(params) {
    if (params.id === 'new') {
      return hash({
        webinar: this.store
          .createRecord('webinar', {
            title: '- new webinar -',
            startTime: Date.now()
          })
          .save()
      });
    }

    return hash({
      webinar: this.store.findRecord('webinar', params.id, {
        include: ['person', 'webinar_invitees', 'webinar_invitees.person'].join(
          ','
        ),
        reload: true
      })
    });
  }
}
