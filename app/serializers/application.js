import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  // When saving records to the back-end (PATCH or POST), we only want to send
  // up the attributes that changed, not all of them.
  serializeAttribute(snapshot, json, key, attributes) {
    if (snapshot.record.get('isNew') || snapshot.changedAttributes()[key]) {
      super.serializeAttribute(snapshot, json, key, attributes);
    }
  }
}
