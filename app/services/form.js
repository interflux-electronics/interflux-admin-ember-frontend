import Service from '@ember/service';

export default class FormService extends Service {
  count = 0;

  getUniqueId() {
    this.count = this.count + 1;
    return this.count;
  }
}
