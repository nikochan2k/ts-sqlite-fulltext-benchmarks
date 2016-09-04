const ab = new ArrayBuffer(10);
const i32 = new Int32Array(10);
const d = new DataView(ab);

console.log(ab instanceof ArrayBuffer);
console.log(i32.buffer instanceof ArrayBuffer);
console.log(d.buffer instanceof ArrayBuffer);

console.log(Object.prototype.toString.call(ab));
console.log(Object.prototype.toString.call(i32));
console.log(Object.prototype.toString.call(d));
