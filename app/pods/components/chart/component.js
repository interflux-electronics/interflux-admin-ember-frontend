import Component from '@glimmer/component';

export default class ChartComponent extends Component {
  // @arg data
  // @arg type
  // @arg theme

  get blocks() {
    const totals = this.args.data.map((record) => record.total);
    const max = Math.max(...totals);

    return this.args.data.map((record) => {
      const total = record.total;
      const ratio = record.total / max;
      const height = Math.round(100 * ratio); // max height is 100px
      const label = [
        'Jan 2024',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec 2024'
      ][record.month - 1];

      return { total, height, label };
    });
  }
}
