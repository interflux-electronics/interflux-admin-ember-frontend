import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class UseController extends Controller {
  @service router;

  get use() {
    return this.model.use;
  }

  get maxAvatarCountReached() {
    return this.use.imageCount >= 4;
  }

  @tracked userClickedDelete = false;

  @action
  async destroyRecord() {
    this.userClickedDelete = true;
    if (this.use.canBeDeleted) {
      console.warn(`destroying record ${this.use.id}`);
      await this.use.destroyRecord();
      console.warn('destroyed');
      this.router.transitionTo('secure.families');
    }
  }

  get showDeleteInstructions() {
    return !this.use.canBeDeleted && this.userClickedDelete;
  }
}
