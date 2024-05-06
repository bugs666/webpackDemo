const PENDING = 'pending', FULFILLED = 'fulfilled', REJECTED = 'rejected';


function resolvePromise(...rest) {
    let [valueOrReason, resolve, reject] = rest;
    if (valueOrReason instanceof Promise) {
        valueOrReason.then(v => resolvePromise(v, resolve, reject)).catch(reject)
    } else if (!!valueOrReason && ['function', 'object'].includes(typeof valueOrReason)) {
        let called = false;
        try {
            let then = valueOrReason.then;
            if (typeof then === 'function') {
                then.call(valueOrReason, v => {
                    if (!called) {
                        called = true;
                        resolvePromise(v, resolve, reject);
                    }
                }, error => {
                    if (!called) {
                        called = true;
                        reject(error);
                    }
                })
            } else {
                called = true;
                resolve(valueOrReason);
            }
        } catch (error) {
            if (!called) {
                called = true;
                reject(error)
            }
        }
    } else {
        resolve(valueOrReason);
    }
}

class MyPromise {
    status = PENDING;
    value = undefined;
    reason = undefined;
    // 可能会存在异步的情况，保存异步
    onResolvedCallbacks = [];
    onRejectedCallbacks = [];

    constructor(executor) {
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    then(onResolve, onReject) {
        // 根据接收的参数构建成功、失败的回调
        onResolve = typeof onResolve === 'function' ?
            onResolve : value => value;
        onReject = typeof onReject === 'function' ?
            onReject : reason => {
                throw new Error(reason)
            };
        // 构建返回新promise对象
        let privatePromise = new MyPromise((resolve, reject) => {
            switch (this.status) {
                case FULFILLED: {
                    setTimeout(() => {
                        try {
                            let value = onResolve(this.value);
                            // value有可能是一个嵌套的promise，递归执行
                            resolvePromise(/*privatePromise, */value, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                    break;
                }
                case REJECTED: {
                    setTimeout(() => {
                        try {
                            let reason = onReject(this.reason);
                            // value有可能是一个嵌套的promise，递归执行
                            resolvePromise(/*privatePromise,*/ reason, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                    break;
                }
                default: {
                    this.onResolvedCallbacks.push(() => {
                        setTimeout(() => {
                            try {
                                let value = onResolve(this.value);
                                // value有可能是一个嵌套的promise，递归执行
                                resolvePromise(/*privatePromise,*/ value, resolve, reject);
                            } catch (error) {
                                reject(error)
                            }
                        }, 0)
                    });
                    this.onRejectedCallbacks.push(() => {
                        setTimeout(() => {
                            try {
                                let reason = onReject(this.reason);
                                // value有可能是一个嵌套的promise，递归执行
                                resolvePromise(/*privatePromise,*/ reason, resolve, reject);
                            } catch (error) {
                                reject(error)
                            }
                        }, 0)
                    })
                    break;
                }

            }
        });
        return privatePromise;
    }

    catch(onReject) {
        return this.then(null, onReject);
    }

    finally(onFinally) {
        return this.then(v => {
            onFinally()
            return v;
        }, reason => {
            onFinally();
            return reason;
        })
    }
}

// 测试用例
let promise = new MyPromise((resolve) => resolve(1));
promise.then(value => {
    return Promise.resolve(value + 1).then(v => (Promise.resolve(v + 1)))
}).then(console.log)

const asyncOperation = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步逻辑 等待1s');
    }, 1000);
});

asyncOperation
    .then(value => {
        console.log('then:', value);
        return '1. 第一个then的返回';
    }).then(value => {
    console.log('Second then:', value);
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('2. 第二个then的返回');
        }, 500);
    });
}).then(value => {
    console.log('Third then:', value);
    throw new Error('3. 第三个then会报一个错误');
}).catch(error => {
    console.error('Catch:', error.message);
}).finally(() => {
    console.log('兜底')
});
