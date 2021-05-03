import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ImagesController extends Controller {
  queryParams = [{ query: 'search' }];

  @tracked query = '';
}
