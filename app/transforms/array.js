import Transform from '@ember-data/serializer/transform';

export default class ArrayTransform extends Transform {
  deserialize(serialized) {
    if (!serialized) {
      return [];
    }
    return serialized.split(',');
  }

  serialize(deserialized) {
    if (!deserialized) {
      return '';
    }
    return deserialized.join(',');
  }
}
