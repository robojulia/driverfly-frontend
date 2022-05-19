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

/**
 * @param {import("yup/lib/util/createValidation").TestContext} thisObj
 * @param {any[]} list 
 * @param {string} field
 * @param {object} options 
 * @param {any => string} options.mapper
 * @param {string} message
 */
function unique(thisObj, list, field, options, message) {
  if (list) {
    const { mapper } = options;
    const set = new Set();

    for (let i = 0; i < list.length; i++) {
      let value = !options.mapper ? yup.ref(field).getter(list[i]) : mapper(list[i]);

      if (!value) continue;

      if (set.has(value)) {
        return thisObj.createError({
          path: `${thisObj.path}[${i}].${field}`,
          message: message,
          params: {
            field: field
          },
          type: "unique"
        });
        return false;
      }
      set.add(value);
    }
  }
  return true;
}

/**
 * 
 * @param {string} field 
 * @param {object} options 
 * @param {(any) => string} options.mapper
 * @param {string} message
 * @this import("yup/lib/array").OptionalArraySchema
 */
unique.addTest = function (field, options, message) {
  if (typeof options === "string") {
    message = options;
    options = null;
  }
  if (!message) message = "yup.array.unique";
  if (!options) options = {};

  if (message) {
    return this.test("unique", message, function (list) {
      return unique(this, list, field, options, message);
    });
  }
  return this.test("unique", function() { return this.createError() }, function (list) {
    return unique(this, list, field, options, message);
  });
}

yup.addMethod(yup.array, "unique", unique.addTest);

// export default {
//   object: yup.object,
//   string: yup.string,
//   number: yup.number,

//   entity: (schema) => yup.mixed().when({
//     is: v => !!v,
//     then: schema
//   })
// };