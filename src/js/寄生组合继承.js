function Animal() {
    this.children = []
    this.type = 'animal'
}

Animal.prototype.birth = function (child) {
    this.children.push(child);
}

function Monkey() {
    this.grand = 'monkey'
}

function Man(name) {
    this.name = name;
    Animal.call(this, arguments);
    Monkey.call(this, arguments);
}

const otherTemplatePrototype = [Animal.prototype, Monkey.prototype]
Man.prototype = Object.assign({}, ...otherTemplatePrototype);
Man.prototype.constructor = Man;

let zhangsan = new Man('张三');
zhangsan.birth('张四')
let lisi = new Man('李四');
console.log(lisi.children); //[]
console.log(zhangsan.grand); // monkey
