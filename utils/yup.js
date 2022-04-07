import * as yup from "yup"

yup.addMethod(yup.string, "enum", function(enumType, message) {
  const keys = Object.keys(enumType);
  const set = new Set(keys);
  return this.test("enum", message, function (str) {
      if (str && !set.has(str)) {
        if (!message) {
          message = `${this.path} must be one of ${keys.join(", ")}`;
        }
        return this.createError({
          path: this.path,
          message: message
        });
      }
      return true;
  });
});

yup.addMethod(yup.array, "unique", function (message, field, mapper = a => a) {
  return this.test(`unique`, message, function (list) {
    const set = new Set();
    //debugger;
    for (let i = 0; i < list.length; i++) {
      let value = mapper(list[i]);

      if (set.has(value)) {
        // debugger;
        return this.createError({
          path: `${this.path}[${i}].${field}`,
          message: message
        });
        return false;
      }
      set.add(value);
    }
    return true;
  });
});
