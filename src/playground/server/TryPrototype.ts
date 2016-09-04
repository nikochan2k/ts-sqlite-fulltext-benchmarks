const TestClass: any = () => { };
TestClass.show = () => {
  console.log("not prototype");
};
TestClass.prototype.show = () => {
  console.log("prototype");
};

const testClass = new TestClass();
console.log(testClass);
testClass.show();
