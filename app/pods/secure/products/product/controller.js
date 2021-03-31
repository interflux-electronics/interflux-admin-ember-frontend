import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';

export default class ProductController extends Controller {
  @alias('model.product') product;

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

  get statusOptions() {
    return [
      {
        value: 'new',
        label:
          '**New** - This product is new and we want it to receive maximum attention. New products are sorted to the top of every product list. Highlighted as "New". In production. Can be ordered.'
      },
      {
        value: 'popular',
        label:
          '**Popular** - This product is one of our best sellers. Popular products are sorted to the top every product list, right below new products. Highlighted as "Popular". In production. Can be ordered.'
      },
      {
        value: 'recommended',
        label:
          '**Recommended** - Most of our products. Sorted below new and popular products. No highlights. In production. Can be ordered.'
      },
      {
        value: 'outdated',
        label:
          '**Outdated** - This product has been outdated by a better product and we no longer want to promote it. The reason we still produce this product is because some customers still rely on it and are unable to switch to our better product. Outdated products are hidden from the product lists, however their product pages can still be found via Google, via our product search bar or by clicking a checkbox next to the product list.'
      },
      {
        value: 'discontinued',
        label:
          '**Discontinued** - This product can no longer be produced nor ordered. Just like outdated products, these are hidden from the product lists, unless a checkbox is ticked. Their product pages can still be found via Google and our product search bar.'
      },
      {
        value: 'offline',
        label:
          '**Offline** - This product is entirely hidden from our website and will be removed from the Google search results.'
      }
    ];
  }

  get testResults() {
    const str = this.model.product.testResults;
    if (!str) {
      return [['', '', '']];
    }
    const arr = JSON.parse(str);
    if (arr.length < 1) {
      return [['', '', '']];
    }
    return JSON.parse(str);
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
    const str = this.model.product.testResults;
    const arr = JSON.parse(str);
    arr.push(['-', '-', '-']);
    this.saveTestResults(arr);
  }

  @action
  removeRow() {
    const str = this.model.product.testResults;
    const arr = JSON.parse(str).slice(0, -1);
    this.saveTestResults(arr);
  }

  saveTestResults(arr) {
    const str = arr.length < 1 ? null : JSON.stringify(arr);
    this.model.product.testResults = str;
    this.product.save({
      adapterOptions: {
        whitelist: 'testResults'
      }
    });
  }
}
