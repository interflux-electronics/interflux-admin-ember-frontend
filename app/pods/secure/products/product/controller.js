import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ProductController extends Controller {
  @service router;

  get product() {
    return this.model.product;
  }

  get publicImages() {
    return this.product.productImages.filterBy('public', true).sortBy('rank');
  }

  get hiddenImages() {
    return this.product.productImages.rejectBy('public', true);
  }

  get publicImageCount() {
    return this.publicImages.length;
  }

  @action
  showImage(rel) {
    rel.rank = 999;
    rel.public = true;
    this.redoRanks();
  }

  @action
  hideImage(rel) {
    rel.public = false;
    rel.rank = 0;
    this.redoRanks();
  }

  @action
  moveImageUp(rel) {
    rel.rank = rel.rank - 1.5; // subtracting 1.5 sorts this image between -1 and -2
    this.redoRanks();
  }

  @action
  moveImageDown(rel) {
    rel.rank = rel.rank + 1.5; // adding 1.5 sorts this image between +1 and +2
    this.redoRanks();
  }

  @action
  setAvatar(rel) {
    rel.rank = 0.5;
    this.product.image = rel.image;
    this.redoRanks();
    this.product.save({
      adapterOptions: {
        whitelist: 'image'
      }
    });
  }

  redoRanks() {
    this.publicImages.forEach((relation, i) => {
      relation.rank = i + 1;
    });
    this.saveDirtyImages();
  }

  saveDirtyImages() {
    const dirtyImages = this.product.productImages.filterBy(
      'hasDirtyAttributes',
      true
    );

    dirtyImages.forEach((relation) => {
      relation.save();
    });
  }

  get mainFamilyOptions() {
    return this.model.families.sortBy('rank').map((family) => {
      return { value: family, label: family.nameSingle };
    });
  }

  get lifeCycleOptions() {
    return [
      {
        value: 'popular',
        label: '**Popular** - Best-sellers for years. On front page.'
      },
      {
        value: 'new',
        label: '**New** - New and upcoming. On front page.'
      },
      {
        value: 'promoted',
        label: '**Promoted** - In view.'
      },
      {
        value: 'demoted',
        label: '**Demoted** - Hidden from view, but findable.'
      },
      {
        value: 'replaced',
        label: '**Replaced** - There is a better product.'
      },
      {
        value: 'discontinued',
        label: '`**Discontinued** - End of life. Cannot be ordered.'
      },
      {
        value: 'offline',
        label: '**Offline** - Excluded from our public websites.'
      }
    ];
  }

  // TEST RESULTS

  get testResults() {
    try {
      const arr = JSON.parse(this.product.testResults);

      if (arr.length < 1) {
        return [['', '', '']];
      }

      return arr;
    } catch (e) {
      console.warn('invalid testResults format');
      return [['', '', '']];
    }
  }

  @action
  updateCell(i, ii, event) {
    console.log(i, ii, event.target.value);
    const arr = this.testResults;
    arr[i][ii] = event.target.value;
    this.saveTestResults(arr);
  }

  @action
  addRow() {
    const str = this.product.testResults;
    const arr = JSON.parse(str);
    arr.push(['-', '-', '-']);
    this.saveTestResults(arr);
  }

  @action
  removeRow() {
    const str = this.product.testResults;
    const arr = JSON.parse(str).slice(0, -1);
    this.saveTestResults(arr);
  }

  saveTestResults(arr) {
    const str = arr.length < 1 ? null : JSON.stringify(arr);
    this.product.testResults = str;
    this.product.save({
      adapterOptions: {
        whitelist: 'testResults'
      }
    });
  }

  // After the name is changed, the slug will automatically be updated as well.
  // Therefor we need to redirect the admin user to the new URL, otherwise refresh will fail.
  @action
  afterSaveName() {
    const newSlug = this.product.name
      .replace(/\s/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

    this.router.transitionTo('secure.products.product', newSlug);

    // TODO: refresh the parent route
  }

  @action
  saveAlternativeAvatar(productUse, image) {
    productUse.image = image;
    productUse
      .save({
        adapterOptions: {
          whitelist: 'image'
        }
      })
      .then(() => {
        console.debug('success');
      })
      .catch((response) => {
        // Log error in console
        this.api.logError(response);

        // Show error to user
        try {
          this.error = response.errors[0].code || 'unknown';
        } catch (e) {
          this.error = 'unknown';
        }
      });
  }
}
