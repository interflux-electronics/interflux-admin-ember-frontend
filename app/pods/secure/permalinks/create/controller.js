import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class WebinarCreateController extends Controller {
  @service router;
  @service store;

  @tracked isSaving = false;

  get permalink() {
    return this.model.permalink;
  }

  get preventSave() {
    const url = this.permalink.redirectTo;
    const regex =
      /(https:\/\/www\.|https:\/\/)[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/g;

    const valid = url && url.match(regex);

    return !valid;
  }

  @action
  async onSave() {
    this.permalink.slug = this.uniqueRandomSlug();

    this.isSaving = true;

    const success = () => {
      this.router.transitionTo(
        'secure.permalinks.permalink',
        this.permalink.id
      );
    };

    const fail = (error) => {
      console.error('save failed', error);
    };

    const done = () => {
      this.isSaving = false;
    };

    this.permalink
      .save({
        adapterOptions: {
          whitelist: ['slug', 'redirectTo', 'notes']
        }
      })
      .then(success)
      .catch(fail)
      .finally(done);
  }

  uniqueRandomSlug() {
    let slug = null;
    let unique = false;

    while (!slug && !unique) {
      slug = this.randomSlug();
      console.log('RANDOM:', slug);
      unique = this.store.peekAll('permalink').findBy('slug', slug)
        ? true
        : false;
    }

    return slug;
  }

  randomSlug() {
    let slug = '';

    while (slug.length < 3) {
      slug += this.randomLetter();
    }

    return slug;
  }

  randomLetter() {
    const random = Math.floor(Math.random() * this.abc.length);

    return this.abc[random];
  }

  abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
}
