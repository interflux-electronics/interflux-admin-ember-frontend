import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { readOnly } from '@ember/object/computed';

export default class SecureIndexRoute extends Route {
  @service auth;

  @readOnly('auth.user.email') email;

  @tracked email;
}
