import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SpreadsheetComponent extends Component {
  @tracked count;
  @tracked total;
  @tracked matches;
  @tracked hasMatches;
  @tracked query = '';
  @tracked data;
  @tracked highlighted;
  @tracked sortBy;
  @tracked sortUp = true;
  @tracked lauyout = 'normal'; // image-rows, image-tiles

  @service router;

  constructor() {
    super(...arguments);
    const n = this.args.records.length;
    this.count = n;
    this.total = n;
    this.matches = this.args.records.mapBy('id');
    this.sortBy = this.args.sortBy || this.args.columns[0].key;
    this.sortUp = this.args.sortUp === false ? false : true;
  }

  get sortedRecords() {
    const arr = this.args.records.sortBy(this.sortBy);
    const isBlank = (x) => {
      return x[this.sortBy] === null || x[this.sortBy] === undefined;
    };
    const blanks = arr.filter(isBlank);
    const values = arr.reject(isBlank);
    const records = [...values, ...blanks];

    if (this.sortUp) {
      return records;
    } else {
      return records.reverse();
    }
  }

  @action
  selectText(event) {
    window.getSelection().selectAllChildren(event.target);
  }

  @action
  register(element) {
    this.data = element;
  }

  @action
  onKeyDown(event) {
    // On Enter:
    // 1. Prevent a second line from being added to the [contenteditable]
    // 2. Fire the select event for currently highlighted row
    if ('Enter' === event.key) {
      event.preventDefault();
      this.select(this.highlighted);
    }

    if ('ArrowDown' === event.key) {
      const current = this.matches.indexOf(this.highlighted);
      const next = this.matches[current + 1] || this.matches[0];
      this.highlight(next);
    }

    if ('ArrowUp' === event.key) {
      const current = this.matches.indexOf(this.highlighted);
      const last = this.matches.length - 1;
      const prev = this.matches[current - 1] || this.matches[last];
      this.highlight(prev);
    }
  }

  @action
  onKeyUp(event) {
    const query = event.target.innerText.replace(/(\r\n|\n|\r)/gm, '');
    const queryHasChanged = query !== this.query;
    if (queryHasChanged) {
      this.query = query;
      this.filter(query);
    }
  }

  @action
  highlight(id) {
    this.highlighted = id;
    this.data.querySelectorAll('li.highlight').forEach((li) => {
      li.classList.remove('highlight');
    });
    this.data.querySelectorAll(`li[data-record="${id}"]`).forEach((li) => {
      li.classList.add('highlight');
    });
  }

  @action
  filter(query) {
    const arr = [];
    const regex = new RegExp(`(${query})`, 'ig');

    // Mark all text that matches the query with <mark>
    this.data.querySelectorAll('[data-search="me"]').forEach((el) => {
      if (regex.test(el.textContent)) {
        el.innerHTML = el.textContent.replace(regex, '<mark>$1</mark>');
        arr.push(el.closest('li').dataset.record);
      } else {
        el.innerHTML = el.textContent;
      }
    });

    const matches = [...new Set(arr)];

    this.data.querySelectorAll('li').forEach((li) => {
      const isMatch = matches.find((u) => u === li.dataset.record);

      if (isMatch) {
        li.classList.add('show');
        li.classList.remove('hide');
      } else {
        li.classList.add('hide');
        li.classList.remove('show');
      }
    });

    this.matches = matches;
    this.count = matches.length;
    this.hasMatches = matches.length ? true : false;

    if (matches.length) {
      const id = matches[0];
      this.highlight(id);
    }
  }

  @action
  select(id) {
    this.router.transitionTo(this.args.linkRoute, id);
  }

  @action
  setSortBy(key) {
    if (this.sortBy === key) {
      this.sortUp = !this.sortUp;
    } else {
      this.sortBy = key;
      this.sortUp = true;
    }

    // Always reset the highlight or it may jump down the list
    this.highlighted = null;
  }
}
