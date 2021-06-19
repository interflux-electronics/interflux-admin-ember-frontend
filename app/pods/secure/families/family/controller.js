import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FamilyController extends Controller {
  @service router;

  get family() {
    return this.model.family;
  }

  get imageCount() {
    if (!this.family.productFamilyImages) {
      return 0;
    }
    return this.family.productFamilyImages.length;
  }

  get maxAvatarCountReached() {
    return this.imageCount >= 4;
  }

  get sortedImages() {
    return this.model.family.productFamilyImages.sortBy('rankAmongImages');
  }

  get mainFamilies() {
    return this.model.families
      .filterBy('isMainFamily')
      .sortBy('rank')
      .map((family) => {
        const { namePlural, rank } = family;
        const isCurrent = family.id === this.model.family.id;

        return { namePlural, rank, isCurrent };
      });
  }

  @action
  redirect(id) {
    this.router.transitionTo('secure.families.family', id);
  }

  @action
  async destroyRecord() {
    this.userClickedDelete = true;
    if (this.family.canBeDeleted) {
      console.warn(`destroying record ${this.family.id}`);
      await this.family.destroyRecord();
      console.warn('destroyed');
      this.router.transitionTo('secure.families');
    }
  }

  @tracked userClickedDelete = false;

  get showDeleteInstructions() {
    return !this.family.canBeDeleted && this.userClickedDelete;
  }
}
