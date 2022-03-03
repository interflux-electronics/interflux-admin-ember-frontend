import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class WebinarRoute extends ModalRoute {
  model(params) {
    return hash({
      webinar: this.store.findRecord('webinar', params.id, {
        include: [
          'image',
          'video',
          'person',
          'webinar_invitees',
          'webinar_invitees.person',
          'webinar_attendees',
          'webinar_attendees.person'
        ].join(',')
      })
    });
  }
}
