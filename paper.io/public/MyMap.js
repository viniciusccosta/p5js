class MyMap extends Map {
  add(value) {
    super.set(value.toString(), value);
    this.last = value;
  }
  fromArray(array) {
    if (array != null) {
      for (var i = 0; i < array.length; i++) {
        var value = array[i];
        if (value != null) {
          this.add(value);
        }
      }
    }
  }
}
