class Greeter extends A {
    greeting: string;
    constructor(message: string) {
        super();
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

class A {
    greet2(i: number): number {
        return i + 10;
    }
}

var greeter = new Greeter("world");
var greet: string = greeter.greet();
var val: number = greeter.greet2(10);

console.log(greet + val);