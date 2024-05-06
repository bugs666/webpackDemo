function myNew(template, ...props) {
    // 创建空对象 &  将空对象的原型对象指向模板类的原型
    let obj = Object.create(template.prototype);
    // 模板类执行
    let result = template.call(obj, ...props);
    return typeof result === 'object' ? result : obj;
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

let zhangsan = myNew(Person, '张三', 18);
console.log(zhangsan);
