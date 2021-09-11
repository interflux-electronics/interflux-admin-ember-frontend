import JSONAPISerializer from '@ember-data/serializer/json-api';

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
// The example below serializes all if the record is new.
// If not new, it only serialises the dirty attributes.
// if (snapshot.record.get('isNew') || snapshot.changedAttributes()[key]) {
//   super.serializeAttribute(snapshot, json, key, attributes);
// }
//
export default class ApplicationSerializer extends JSONAPISerializer {
  // Include only the whitelisted attributes in the JSON payload
  serializeAttribute(snapshot, json, key) {
    const include = this.includeKeyInPayload(snapshot, key);

    if (include) {
      super.serializeAttribute(...arguments);
    }
  }

  // Include only the whitelisted relations in the JSON payload
  serializeBelongsTo(snapshot, json, relationship) {
    const include = this.includeKeyInPayload(snapshot, relationship.key);

    if (include) {
      super.serializeBelongsTo(...arguments);
    } else {
      return;
    }
  }

  // Include only the whitelisted relations in the JSON payload
  serializeHasMany(snapshot, json, relationship) {
    const include = this.includeKeyInPayload(snapshot, relationship.key);

    if (include) {
      super.serializeHasMany(...arguments);
    } else {
      return;
    }
  }

  // Returns boolean, whether the given key should be included in the payload or not
  includeKeyInPayload(snapshot, key) {
    const options = snapshot.adapterOptions;

    return (
      !options ||
      (options && options.whitelist && options.whitelist.includes(key))
    );
  }
}
