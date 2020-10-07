import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  serializeAttribute(snapshot, json, key, attributes) {
    // When calling record.save(), Ember serializers default to including all attributes and
    // relationships to into the JSON request payload. This triggers more processing and validation
    // logic than needed on the backend. It also prevents us from saving just one attribute at a
    // time for a better user experience. Luckily Ember serializers are pretty awesome and give us
    // the flexibility to pass custom adapterOptions when we save which we use to whitelist all the
    // attributes and relationships we want to include in the payload.
    //
    // Usage:
    // record.save({
    //   adapterOptions: {
    //     whitelist: ['someAttribute', 'someRelationship']
    //   }
    // })
    //
    // TODO: figure out how to prevent isDirty to be reset on all attributes
    //
    const options = snapshot.adapterOptions;
    const include =
      !options ||
      (options && options.whitelist && options.whitelist.includes(key));

    if (include) {
      super.serializeAttribute(snapshot, json, key, attributes);
    }

    // The example below serializes all if the record is new.
    // If not new, it only serialises the dirty attributes.
    // if (snapshot.record.get('isNew') || snapshot.changedAttributes()[key]) {
    //   super.serializeAttribute(snapshot, json, key, attributes);
    // }
  }
}
