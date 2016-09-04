class Parent {
  text: String;

  constructor() {
    this.text = "Parent";
  }

  showText() {
    console.log("Parent: " + this.text);
  }
}

class Child extends Parent {
  constructor() {
    super();
    this.text = "Child";
  }

  showText() {
    console.log("Child: " + this.text);
  }
}

const p = new Parent();
console.log("value: " + p["text"] + ", hasOwnProperty: " + (<Object>p).hasOwnProperty("text"));
console.log("value: " + p["showText"] + ", hasOwnProperty: " + (<Object>p).hasOwnProperty("showText"));

const c2: Parent = {
  text: "Child2",

  showText: function(this: Parent){
    console.log("Child: " + this.text);
  }
};
console.log("value: " + c2["text"] + ", hasOwnProperty: " + (<Object>c2).hasOwnProperty("text"));
console.log("value: " + c2["showText"] + ", hasOwnProperty: " + (<Object>c2).hasOwnProperty("showText"));
