const data: any = {
  "null": null,
  "string": "文字",
  "integer": 123,
  "double": 123.456,
  "boolean": true,
  "emptyArray": [],
  "nullArray": [null, null],
  "stringArray": ["a", "b", "c"],
  "numberArray": [1, 2, 3],
  "booleanArray": [true, false],
  "anyArray": [false, 1, "2"],
  "doubleArray": [["a", "b", "c"], [1, 2, 3], [true, false]],
  "object": {
    "name": "Ichiro",
    "number": 51,
    "hero": true,
    "when_retire": null
  },
  "objectArray": [
    {},
    {
      "name": "Matsui",
      "number": 55,
      "retired": true
    }
  ]
}; // count = 48

function benchmark(description: string, value: any, action: (value: any) => number): void {
  'use strict';
  action(value);
  const start = new Date();
  for (let i = 0; i < 100000; i++) {
    action(value);
  }
  const end = new Date();
  if (description) {
    console.log(description + ": " + (end.getTime() - start.getTime()) + "ms");
  }
}

function detectByTypeOf(value: any): number {
  "use strict";
  if (value == null) {
    // null or undefined
    return 1;
  }
  const type = typeof value;
  if (type === "string") {
    return 1;
  } else if (type === "number") {
    return 1;
  } else if (type === "boolean") {
    return 1;
  } else if (type === "object") {
    let count = 1;
    if (Array.isArray(value)) {
      const length = value.length;
      if (0 < length) {
        for (let i = 0; i < length; i++) {
          count += detectByTypeOf(value[i]);
        }
      }
    } else {
      for (let key in value) {
        if (!value.hasOwnProperty(key)) {
          continue;
        }
        count += detectByTypeOf(value[key]);
      }
    }
    return count;
  }
  return 0;
}

function detectByObjectKeys(value: any): number {
  "use strict";
  if (value == null) {
    // null or undefined
    return 1;
  }
  const type = typeof value;
  if (type === "string") {
    return 1;
  } else if (type === "number") {
    return 1;
  } else if (type === "boolean") {
    return 1;
  } else if (type === "object") {
    let count = 1;
    if (Array.isArray(value)) {
      const length = value.length;
      if (0 < length) {
        for (let i = 0; i < length; i++) {
          count += detectByObjectKeys(value[i]);
        }
      }
    } else {
      const keys = Object.keys(value);
      for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
        count += detectByObjectKeys(value[keys[i]]);
      }
    }
    return count;
  }
  return 0;
}

const OBJECT = Object.prototype.toString.call({});
const ARRAY = Object.prototype.toString.call([]);
const STRING = Object.prototype.toString.call("");
const NUMBER = Object.prototype.toString.call(0);
const NULL = Object.prototype.toString.call(null);
const BOOLEAN = Object.prototype.toString.call(true);

function detectByObjectKeys2(value: any): number {
  "use strict";
  const type = Object.prototype.toString.call(value);
  let count = 1;
  switch (type) {
    case STRING:
      return count;
    case NUMBER:
      return count;
    case BOOLEAN:
      return count;
    case NULL:
      return count;
    case ARRAY:
      const length = value.length;
      if (0 < length) {
        for (let i = 0; i < length; i++) {
          count += detectByObjectKeys2(value[i]);
        }
      }
      return count;
    case OBJECT:
      const keys = Object.keys(value);
      for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
        count += detectByObjectKeys2(value[keys[i]]);
      }
      return count;
    default:
      return 0;
  }
}

const ARRAY_C = [].constructor;
const STRING_C = "".constructor;
const NUMBER_C = (0).constructor;
const BOOLEAN_C = (true).constructor;

function detectByObjectKeys3(value: any): number {
  "use strict";
  if (value == null) {
    // null or undefined
    return 1;
  }
  const c = value.constructor;
  if (c === STRING_C) {
    return 1;
  } else if (c === NUMBER_C) {
    return 1;
  } else if (c === BOOLEAN_C) {
    return 1;
  } else if (c === ARRAY_C) {
    let count = 1;
    const length = value.length;
    if (0 < length) {
      for (let i = 0; i < length; i++) {
        count += detectByObjectKeys3(value[i]);
      }
    }
    return count;
  } else {
    let count = 1;
    const keys = Object.keys(value);
    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
      count += detectByObjectKeys3(value[keys[i]]);
    }
    return count;
  }
}

function detectByObjectKeys4(value: any): number {
  "use strict";
  if (value === null) {
    return 1;
  }
  const type = typeof value;
  if (type === "string") {
    return 1;
  } else if (type === "number") {
    return 1;
  } else if (type === "boolean") {
    return 1;
  } else {
    const length = value.length;
    let count = 1;
    if (0 <= length) {
      for (let i = 0; i < length; i++) {
        count += detectByObjectKeys(value[i]);
      }
    } else {
      const keys = Object.keys(value);
      for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
        count += detectByObjectKeys(value[keys[i]]);
      }
    }
    return count;
  }
}


//benchmark("detectByTypeOf", data, detectByTypeOf);
benchmark("detectByObjectKeys", data, detectByObjectKeys);
//benchmark("detectByObjectKeys2", data, detectByObjectKeys2);
//benchmark("detectByObjectKeys3", data, detectByObjectKeys3);
benchmark("detectByObjectKeys4", data, detectByObjectKeys4);
