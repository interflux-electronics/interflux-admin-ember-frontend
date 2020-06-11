import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputBelongsToComponent extends Component {
  @tracked query = '';
  @tracked showDropdown = false;

  dropdown;

  @action
  onInsert(element) {
    this.dropdown = element;
  }

  @action
  select(option) {
    console.log(option.nameEnglish);
  }

  @action
  highlight(i) {
    const el = this.dropdown.querySelector('li.focus');
    const arr = this.dropdown.querySelectorAll('li.show');
    if (el) {
      el.classList.remove('focus');
    }
    if (arr.length) {
      arr[i - 1].classList.remove('focus');
    }
  }

  @action
  filter(query) {
    // Hide and reset dropdown if there is no query
    if (!query) {
      this.dropdown.classList.add('hide');
      this.dropdown.querySelectorAll('li').forEach(el => {
        el.classList.remove('show');
        el.classList.remove('hide');
      });
    }

    // Show dropdown if there is a query
    this.dropdown.classList.add('show');

    const regex = new RegExp(`(${query})`, 'ig');

    // Mark all text that matches the query with <mark>
    this.dropdown.querySelectorAll('li').forEach(el => {
      if (!regex.test(el.textContent)) {
        el.innerHTML = el.textContent;
        el.classList.remove('show');
        el.classList.add('hide');
      } else {
        el.innerHTML = el.textContent.replace(regex, '<mark>$1</mark>');
        el.classList.add('show');
        el.classList.remove('hide');
      }
    });

    const count = this.dropdown.querySelectorAll('li.show');

    // Updat the counters
    this.count = query ? count : this.max;

    // After each query we highlight the first one <li> with a match
    if (count) {
      this.highlight(1);
    }
  }
}
