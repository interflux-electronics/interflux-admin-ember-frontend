import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'interflux/config/environment';

export default class ResponsiveVideoComponent extends Component {
  get video() {
    return this.args.video;
  }

  get path() {
    return this.video.path;
  }

  get variations() {
    return this.video.variations;
  }

  get hasValidData() {
    const valid = this.video && this.path && this.variations;

    if (!valid) {
      console.warn('<Video> invalid data');
    }

    return valid;
  }

  // To find the aspect ratio algorithmically, we need to find the greatest common divider (GCD).
  // Inspired from: https://stackoverflow.com/questions/1186414/whats-the-algorithm-to-calculate-aspect-ratio
  findGCD(a, b) {
    return b == 0 ? a : this.findGCD(b, a % b);
  }

  get ratio() {
    if (!this.variations) {
      return null;
    }

    // First size found in variations
    const size = this.variations.split(',')[0].split('@')[1].split('.')[0];
    const width = size.split('x')[0];
    const height = size.split('x')[1];

    // The greatest common divider
    const gcd = this.findGCD(width, height);
    const ratioWidth = width / gcd;
    const ratioHeight = height / gcd;

    return `${ratioWidth}:${ratioHeight}`;
  }

  get ratioWidth() {
    return this.ratio.split(':')[0];
  }

  get ratioHeight() {
    return this.ratio.split(':')[1];
  }

  @action
  onInsert(svg) {
    this.optimalWidth = svg.clientWidth;
    this.optimalHeight = svg.clientHeight;
  }

  @tracked optimalWidth;
  @tracked optimalHeight;

  get showVideo() {
    return (
      this.optimalWidth &&
      this.optimalHeight &&
      (this.closestMP4size || this.closestWEBMsize)
    );
  }

  get MP4s() {
    return this.variations.split(',').filter((x) => x.split('.')[1] === 'mp4');
  }

  get MP4sizes() {
    return this.MP4s.map((x) => x.split('.')[0].replace('@', ''));
  }

  get WEBMs() {
    return this.variations.split(',').filter((x) => x.split('.')[1] === 'webm');
  }

  get WEBMsizes() {
    return this.WEBMs.map((x) => x.split('.')[0].replace('@', ''));
  }

  get closestMP4size() {
    return this.closestSize(this.MP4sizes);
  }

  get closestWEBMsize() {
    return this.closestSize(this.WEBMsizes);
  }

  get MP4src() {
    return `${ENV.cdnHost}/${this.path}@${this.closestMP4size}.mp4`;
  }

  get WEBMsrc() {
    return `${ENV.cdnHost}/${this.path}@${this.closestWEBMsize}.webm`;
  }

  // Accepts and array of sizes "200x200".
  // Returns the one which is above and closest to the optimal width.
  // We filter out the size "original".
  closestSize(sizes) {
    const distances = sizes
      .filter((size) => /^\d{2,4}x\d{2,4}$/.test(size))
      .map((size) => {
        const width = size.split('x')[0];
        return width - this.optimalWidth;
      });

    const larger = distances.filter((d) => d >= 0);
    const smaller = distances.filter((d) => d < 0);

    const closestDistance = larger.length
      ? Math.min(...larger)
      : Math.max(...smaller);

    return sizes.find((size) => {
      const width = size.split('x')[0];
      return width - this.optimalWidth === closestDistance;
    });
  }
}
