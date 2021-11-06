import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class VideosController extends Controller {
  queryParams = [{ query: 'search' }];

  @tracked query = '';
}
