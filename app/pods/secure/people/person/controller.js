import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class PersonController extends Controller {
  @service router;

  get person() {
    return this.model.person;
  }

  @tracked userClickedDelete = false;

  @action
  async destroyRecord() {
    this.userClickedDelete = true;
    if (this.person.canBeDeleted) {
      await this.person.destroyRecord();
      this.router.transitionTo('secure.people');
    }
  }

  get showDeleteInstructions() {
    return !this.person.canBeDeleted && this.userClickedDelete;
  }

  @action
  setAvatar(rel) {
    this.person.image = rel.image;
    this.person.save({
      adapterOptions: {
        whitelist: 'image'
      }
    });
  }

  @action
  afterSaveCompanyMember(record) {
    record.setProperties({ publicTitle: record.public });

    const options = {
      adapterOptions: {
        whitelist: ['publicTitle']
      }
    };

    record.save(options);
  }
}
