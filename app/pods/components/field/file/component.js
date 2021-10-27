import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FieldFileComponent extends Component {
  @service api;

  @action
  onSubmit(event) {
    console.log('onSubmit');

    // Prevent browser from doing a page refresh.
    event.preventDefault();

    const formData = new FormData(event.target);

    this.submitPost(formData)
      .then((data) => {
        console.log('success');
        console.log(data);
      })
      .catch(console.error);
  }

  submitPost = (formData) => {
    console.log('submitPost');
    console.log(formData);

    const url = `${this.api.host}/${this.api.namespace}/uploads`;
    const config = {
      method: 'POST',
      body: formData
    };

    console.log(url);
    console.log(config);

    return fetch(url, config).then((response) => response.json());
  };
}
