import Controller from '@ember/controller';

export default class CompanyController extends Controller {
  get title() {
    return this.model.company.businessName || 'N/A';
  }
}
