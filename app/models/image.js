import Model, { attr } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class ImageModel extends Model {
  @attr('string') cdnPath;
  @attr('array') sizes;
  @attr('array') formats;

  get files() {
    const arr = [];
    const path = this.cdnPath;

    this.formats.forEach(format => {
      this.sizes.forEach(size => {
        const split = size.split('x');
        const [width, height] = split;
        const url = `${ENV.cdnHost}${path}@${size}.${format}`;

        arr.push({
          width,
          height,
          format,
          url
        })
      });
    });

    return arr;
  }
}
