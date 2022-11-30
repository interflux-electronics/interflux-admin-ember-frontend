import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DocumentController extends Controller {
  @service router;

  @tracked deleting = false;

  get document() {
    return this.model.document;
  }

  get filteredCategories() {
    return [
      'TD',
      'declarations',
      'certificates',
      'guides',
      'presentations',
      'webinars'
    ].map((slug) => {
      return this.model.categories.find((c) => c.slug === slug);
    });
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

  @action
  updatePath() {
    console.warn('updating path...');
    this.document.setProperties({
      path: this.document.cdnBasePath
    });
    this.document.save({
      adapterOptions: {
        whitelist: ['path']
      }
    });
  }
}
