const PENDING = 'pending', FULFILLED = 'fulfilled', REJECTED = 'rejected';

class myPromise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        let resolve = value => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }

        let reject = reason => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : error => {
            throw error
        };

        let promise2 = new myPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }

            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }

            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            this.resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });

                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            this.resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
            }
        });

        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('Chaining cycle detected for promise'));
        }

        let called = false;
        if (x instanceof Promise) {
            x.then(y => {
                this.resolvePromise(promise2, y, resolve, reject);
            }, error => {
                reject(error);
            });
        } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
            try {
                let then = x.then;
                if (typeof then === 'function') {
                    then.call(x, y => {
                        if (called) return;
                        called = true;
                        this.resolvePromise(promise2, y, resolve, reject);
                    }, error => {
                        if (called) return;
                        called = true;
                        reject(error);
                    });
                } else {
                    resolve(x);
                }
            } catch (error) {
                if (called) return;
                called = true;
                reject(error);
            }
        } else {
            resolve(x);
        }
    }
}


// 测试用例
const asyncOperation = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步逻辑 等待1s');
    }, 1000);
});

let promise = asyncOperation
    .then(value => {
        console.log('then:', value);
        return '1. 第一个then的返回';
    })
promise
    .then(value => {
        console.log('Second then:', value);
        return new myPromise((resolve, reject) => {
            setTimeout(() => {
                resolve('2. 第二个then的返回');
            }, 500);
        });
    })
    .then(value => {
        console.log('Third then:', value);
        throw new Error('3. 第三个then会报一个错误');
    })
    .catch(error => {
        console.error('Catch:', error.message);
    });
