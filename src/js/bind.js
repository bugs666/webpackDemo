Function.prototype.myBind = function (...rest) {
    if (typeof this !== 'object') {
        throw new Error('context is error')
    }
    const _this = this;
    const [context, ...otherArgs] = rest;
    return function (...args) {
        _this.myApply(context, [...otherArgs, ...args])
    }
}

Function.prototype.myApply = function (...rest) {
    const [context, args] = rest
    context.fn = this;
    const result = context.fn(...args)
    delete context.fn
    return result;
}

const setAge = function (...age) {
    console.log(`${this.name}年龄：`, ...age)
}
let getAge = setAge.myBind({name: '张三'}, 18);
getAge(20)
