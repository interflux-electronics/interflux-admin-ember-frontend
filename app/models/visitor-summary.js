import Model, { attr } from '@ember-data/model';

export default class VisitorSummaryModel extends Model {
  @attr('string') host; // interflux.com
  @attr('string') year; // 2024
  @attr('string') data;
}
