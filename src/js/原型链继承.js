function Person() {
    this.children = []
}

Person.prototype.birth = function (child) {
    this.children.push(child);
}

function Man(name) {
    this.name = name;
}

Man.prototype = new Person();
Man.prototype.constructor = Man

let zhangsan = new Man('张三');
zhangsan.birth('王五');
let lisi = new Man('李四');
console.log(lisi.children);
