import Component from '@glimmer/component';

export default class TableComponent extends Component {
  // @arg data
  // @sortBy

  get columns() {
    return this.args.columns;
  }

  get rows() {
    const rows = [];

    this.args.data.forEach((hash) => {
      const cells = this.args.columns.map((column) => {
        const label = hash[column.key];
        const showFlag = column.showFlag;
        const country = showFlag && hash.country ? hash.country : null;

        return { label, showFlag, country };
      });

      rows.push({ cells });
    });

    // return this.args.data.map(row=>{
    //   return this.columns

    //   // return this.columns

    //   // const row = Object.assign({}, record);

    //   // if ()

    //   // const obj = Object.assign(row, {})
    // });

    // TODO sort

    return rows;
  }
}
