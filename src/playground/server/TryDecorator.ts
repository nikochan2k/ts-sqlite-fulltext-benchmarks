
class DecoratorTest {
  message: string;

  showMessage() {
    console.log(this.message);
  }

  static show(message: string) {
    console.log(message);
  }
}

function logClass(target: any) {
  const temp: any = {};
  let o = () => { };
  while (o) {
    Object.getOwnPropertyNames(o).forEach(
      (name: any) => {
        temp[name] = true;
      }
    );
    o = Object.getPrototypeOf(o);
  }
  if (target) {
    Object.getOwnPropertyNames(target).forEach((name: any) => {
      if (!temp[name]) {
        console.log(name + ': ' + target.propertyIsEnumerable(name));
      }
    });
  }
  const proto = <any>Object.getPrototypeOf(target);
  if (proto) {
    Object.getOwnPropertyNames(proto).forEach((name: any) => {
      if (!temp[name]) {
        console.log(name + ': ' + proto.propertyIsEnumerable(name));
      }
    });
  }
}

function logProperty(target: Object, propertyKey: string | symbol) {
  console.log("target: " + target + ", propertyKey: " + propertyKey.toString());
}
const decoratorTest = new DecoratorTest();
decoratorTest.message = "test";
logClass(decoratorTest);
decoratorTest.showMessage();
