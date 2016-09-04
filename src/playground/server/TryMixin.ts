class Hello {
  say(message: string): void {
    console.log(message);
  }
}

class MixinTest implements Hello {
  say: (message: string) => void;
  hoge: (fuga: string) => string;
}

const mixinTest = new MixinTest();
mixinTest.say("Hello");
