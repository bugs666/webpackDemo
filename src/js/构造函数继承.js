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

Man.prototype.constructor = Man

let zhangsan = new Man('张三');
console.log(zhangsan.type);
