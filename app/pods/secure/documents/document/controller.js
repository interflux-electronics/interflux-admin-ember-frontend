import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DocumentController extends Controller {
  @service router;

  @tracked deleting = false;
  @tracked renaming = false;

  get document() {
    return this.model.document;
  }

  get filteredCategories() {
    return this.model.categories.rejectBy('hasToBeRequested');
  }

  @action
  async deleteRecord() {
    this.deleting = true;
    this.document.files.forEach(async (file) => {
      console.warn('deleting cdnFile', file.path);
      await file.destroyRecord();
    });
    this.document.productDocuments.forEach(async (record) => {
      console.warn('deleting productDocument', record.id);
      await record.destroyRecord();
    });
    console.warn('deleting document', this.document.id);
    await this.document.destroyRecord();
    console.warn('deleted');
    this.router.transitionTo('secure.documents');
  }

  @action async onSelectCategory() {
    if (!this.document.category.get('id')) {
      return;
    }

    await this.delay(3000);

    this.router.refresh();
  }

  @tracked count = 0;

  @action async onSaveName() {
    const n = this.count + 1;

    this.count = n;

    await this.delay(3000);

    if (n < this.count) {
      return;
    }

    this.router.refresh();
  }

  // HELPER

  delay(ms) {
    return new Promise((approve) => {
      window.setTimeout(approve, ms);
    });
  }
}
