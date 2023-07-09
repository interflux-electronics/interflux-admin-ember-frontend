import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class DocumentCreateController extends Controller {
  @service store;
  @service router;

  @tracked isSaving = false;
  @tracked record;

  get document() {
    return this.model.document;
  }

  get category() {
    return this.document.category;
  }

  get preventSave() {
    return !this.document.name || !this.category.get('slug') || this.isSaving;
  }

  @action
  async onSave() {
    const path = this.document.cdnBasePath;

    this.document.path = path;

    this.isSaving = true;

    await this.store
      .findRecord('document', path)
      .then((response) => {
        this.record = response;
      })
      .catch((response) => {
        console.error(response);
      });

    if (this.record) {
      return;
    }

    this.document
      .save({
        adapterOptions: {
          whitelist: ['path', 'name', 'documentCategory']
        }
      })
      .then(() => {
        this.router.transitionTo('secure.documents.document', this.document.id);
      })
      .catch((response) => {
        console.error('save failed', response);
        this.isSaving = false;
      });
  }

  get filteredCategories() {
    return [
      'TD',
      'declarations',
      'certificates',
      'guides',
      'presentations',
      'webinars',
      'manuals'
    ].map((slug) => {
      return this.model.categories.find((c) => c.slug === slug);
    });
  }
}
