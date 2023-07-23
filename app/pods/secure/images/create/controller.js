import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ImageCreateController extends Controller {
  @service router;

  @tracked isSaving = false;

  // get person() {
  //   return this.model.person;
  // }

  // get preventSave() {
  //   return !this.person.firstName || !this.person.lastName;
  // }

  // @action
  // async onSave() {
  //   this.isSaving = true;

  //   const success = () => {
  //     this.router.transitionTo('secure.people.person', this.person.id);
  //   };

  //   const fail = (error) => {
  //     console.error('save failed', error);
  //   };

  //   const done = () => {
  //     this.isSaving = false;
  //   };

  //   this.person
  //     .save({
  //       adapterOptions: {
  //         whitelist: ['firstName', 'lastName']
  //       }
  //     })
  //     .then(success)
  //     .catch(fail)
  //     .finally(done);
  // }
}
