import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SecureCompaniesCompanyController extends Controller {
  @action
  async save(record) {
    if (!record.hasDirtyAttributes) {
      return console.log('record is clean');
    }
    console.log('saving');
    await record.save();
    console.log('saved!');
  }
}
