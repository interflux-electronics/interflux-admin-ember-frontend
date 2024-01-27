import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class CompanyController extends Controller {
  @service router;

  get title() {
    return this.model.company.businessName || 'N/A';
  }

  get company() {
    return this.model.company;
  }

  @tracked userClickedDelete = false;

  @action
  async destroyRecord() {
    this.userClickedDelete = true;
    if (this.company.canBeDeleted) {
      await this.company.destroyRecord();
      this.router.transitionTo('secure.companies');
    }
  }

  get showDeleteInstructions() {
    return !this.company.canBeDeleted && this.userClickedDelete;
  }

  @action
  afterSavePublic() {
    if (this.company.public) {
      return;
    }
    this.company.setProperties({
      shownOnMainWebsite: false,
      shownOnGroupWebsite: false,
      approvedIcsfSupplier: false
    });
    this.company.save();
  }
}
