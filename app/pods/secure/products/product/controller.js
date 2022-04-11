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
        label:
          '**Popular** - These products have been best-sellers for years. Highly promoted on our website.'
      },
      {
        value: 'new',
        label:
          '**New** - Promising and in need of early adopters. Highly promoted on our website.'
      },
      {
        value: 'recommended',
        label:
          '**Mainstream** - Most of our products. Can be ordered. Visible on website and in Google.'
      },
      {
        value: 'outdated',
        label:
          '**Replaced** - Has been replaced by a better product. Can still be ordered. Can still be found on our website and via Google, though we do not actively promote it anymore. We suggest visitors to use a better product instead (if selected).'
      },
      {
        value: 'discontinued',
        label:
          "`**Out of production** - Cannot be ordered. It can however still be found on our website and via Google, though we don't promote it any way. We suggest visitors to use a better product instead (if selected)."
      },
      {
        value: 'offline',
        label: '**Offline** - Hidden from website and Google.'
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
