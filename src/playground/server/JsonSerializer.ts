const json: any = {
  "null": null,
  "undefined": undefined,
  "string": "文字",
  "object_string": new String("new String()"),
  "integer": 123,
  "double": 123.456,
  "object_number": new Number(456.789),
  "boolean": true,
  "object_boolean": new Boolean(false),
  "date": "1970-01-01T00:00:00.000Z",
  "object_date": new Date(),
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
}; // 52

enum DataType {
  Null = 0,
  String = 1,
  Number = 2,
  Boolean = 3,
  Date = 4,
  Base64 = 5,
  Array = 10,
  Object = 11
}

interface Serializer {
  begin(): void;
  commit(): void;
  rollback(): void;
  end(): void;
  serialize(props: Array<string>, dataType: DataType, value: number, text: string): void;
}

class DebugSerializer implements Serializer {
  private keys: any;
  private keyIndex: number;
  private serialized: Array<any>;
  private order: number;

  public begin(): void {
    this.keys = {};
    this.keyIndex = 0;
    this.serialized = [];
    this.order = 1;
  }

  public commit(): void {
    console.log(this.keys);
    console.log(this.serialized);
  }

  public rollback(): void {
  }

  public end(): void {
  }

  public serialize(props: Array<string>, dataType: DataType, value: number, text: string): void {
    const prop = props.join(".");
    let keyId: number;
    if (!this.keys[prop]) {
      this.keys[prop] = this.keyIndex++;
      keyId = this.keyIndex;
    } else {
      keyId = this.keys[prop];
    }
    this.serialized.push({
      keyId: keyId, order: this.order, dataType: dataType, value: value, text: text
    });
    this.order++;
  }

}

class DataRepositry {

  private static STRING = Object.prototype.toString.call("");
  private static NUMBER = Object.prototype.toString.call(0);
  private static BOOLEAN = Object.prototype.toString.call(true);
  private static DATE = Object.prototype.toString.call(new Date());

  private serializer: Serializer;

  public constructor(serializer: Serializer) {
    this.serializer = serializer;
  }

  public serialize(value: any): void {
    const props: Array<string> = [];
    try {
      this.serializer.begin();
      this.serializeValue(props, value);
      this.serializer.commit();
    } catch (e) {
      this.serializer.rollback();
    } finally {
      this.serializer.end();
    }
  }

  protected serializeNull(props: Array<string>): void {
    this.serializer.serialize(props, DataType.Null, null, null);
  }

  protected serializeString(props: Array<string>, str: string) {
    if (str.length === 24) {
      const date = new Date(str);
      if (!isNaN(date.valueOf())) {
        this.serializeDate(props, date);
        return;
      }
    }

    const num = +str;
    this.serializer.serialize(props, DataType.String, isNaN(num) ? null : num, str);
  }

  protected serializeNumber(props: Array<string>, num: number) {
    this.serializer.serialize(props, DataType.Number, num, null);
  }

  protected serializeBoolean(props: Array<string>, bool: boolean) {
    this.serializer.serialize(props, DataType.Boolean, bool ? 1 : 0, null);
  }

  protected serializeDate(props: Array<string>, date: Date) {
    this.serializer.serialize(props, DataType.Date, date.valueOf(), date.toJSON());
  }

  protected serializeBinary(props: Array<string>, buffer: Buffer) {
    this.serializer.serialize(props, DataType.Base64, buffer.byteLength, buffer.toString());
  }

  protected serializeArray(props: Array<string>, array: Array<any>) {
    const length = array.length;
    this.serializer.serialize(props, DataType.Array, length, null);

    for (let i = 0; i < length; i++) {
      this.serializeValue(props, array[i]);
    }
  }

  protected serializeObject(props: Array<string>, obj: any) {
    this.serializer.serialize(props, DataType.Object, null, null);

    const keys = Object.keys(obj);
    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
      const key = keys[i];
      try {
        props.push(key)
        this.serializeValue(props, obj[key]);
      } finally {
        props.pop();
      }
    }
  }

  protected serializeValue(props: Array<string>, value: any): void {
    if (value == null) {
      this.serializeNull(props);
      return;
    }

    const type = typeof value;
    if (type === "string") {
      this.serializeString(props, <string>value);
    } else if (type === "number") {
      this.serializeNumber(props, <number>value);
    } else if (type === "boolean") {
      this.serializeBoolean(props, <boolean>value);
    } else if (Array.isArray(value)) {
      this.serializeArray(props, <Array<any>>value);
    } else if (value instanceof Buffer) {
      this.serializeBinary(props, <Buffer>value);
    } else {
      const clazz = Object.prototype.toString.call(value);
      switch (clazz) {
        case DataRepositry.STRING:
          this.serializeString(props, "" + value);
          break;
        case DataRepositry.NUMBER:
          this.serializeNumber(props, +value);
          break;
        case DataRepositry.BOOLEAN:
          this.serializeBoolean(props, true == value);
          break;
        case DataRepositry.DATE:
          this.serializeDate(props, <Date>value);
          break;
        default:
          this.serializeObject(props, value);
          break;
      }
    }
  }

}

const debugSerializer = new DebugSerializer();
const dataRepository = new DataRepositry(debugSerializer);
dataRepository.serialize(json);
