function Person() {
    this.children = []
    this.type = 'animal'
}

Person.prototype.birth = function (child) {
    this.children.push(child);
}

function Man(name) {
    this.name = name;
    Person.call(this, arguments);
}

Man.prototype = new Person();
Man.prototype.constructor = Man;

let zhangsan = new Man('张三');
zhangsan.birth('张四')
let lisi = new Man('李四');
console.log(lisi.children); //[]
