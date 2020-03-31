import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PageComponent extends Component {
  @service modal;
}
