import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ModalService extends Service {
  @tracked active = false;
  @tracked scroll = 0;
}
