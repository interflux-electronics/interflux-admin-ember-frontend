import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ImagesController extends Controller {
  @action
  onChange(event) {
    console.debug('ImagesController onChange()', { event });
  }

  @action
  onSelect(event) {
    console.debug('ImagesController onSelect()', { event });
  }
}
