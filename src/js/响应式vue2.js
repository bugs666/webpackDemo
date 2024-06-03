class Vue {
    constructor(option) {
        const data = option.data;
        this._data = data;
        // 模拟把data挂载到vue实例上
        proxyData(this, '_data', data);

        // 数据劫持
        new Observer(data);
        new Watcher(this, () => {
            return data.name;
        }, (value) => {
            console.log('值变化了:', value);
        })
    }
}

function proxyData(vm, sourceKey, data) {
    Object.keys(
        data
    ).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm[sourceKey][key]
            },
            set(v) {
                vm[sourceKey][key] = v;
            }
        })
    })
}

// 数据劫持
class Observer {
    constructor(data) {
        this.observer(data);
    }

    observer(data) {
        const dep = new Dep();
        Object.keys(
            data
        ).forEach(key => {
            let v = data[key]
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get() {
                    console.log('开始依赖收集');
                    dep.depend();
                    return v;
                },
                set(value) {
                    console.log('开始派发更新')
                    dep.notify();
                    v = value;
                }
            })
        })
    }
}

// 依赖收集
class Dep {
    static uid = 0
    // 当前正在处理的依赖全局唯一
    static target = null;

    constructor() {
        this.id = Dep.uid++;
        // 当前所有的依赖
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        const index = this.subs.indexOf(sub);
        this.subs.splice(index, 1)
    }

    // 依赖收集
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }

    // 派发更新
    notify() {
        this.subs.forEach(sub => sub.update())
    }

}

// 观察者，建立与Dep的关联
class Watcher {
    constructor(context, executor, cb) {
        this.vm = context;
        this.getter = executor;
        this.cb = cb;
        this.deps = [];
        this.depIds = new Set();
        this.newDeps = [];
        this.newDepIds = new Set();
        this.value = this.get();
    }

    get() {
        Dep.target = this;
        this.newDeps = [];
        this.newDepIds = new Set();
        let value = this.getter();
        Dep.target = null;
        this.deps.forEach(dep => {
            let oldDepExit = this.newDepIds.has(dep.id);
            if (!oldDepExit) {
                dep.removeSub(this);
            }
        })
        this.deps = this.newDeps;
        this.depIds = this.newDepIds;
        return value;
    }

    addDep(dep) {
        let id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDeps.push(dep);
            this.newDepIds.add(id);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }

    update() {
        this.value = this.getter();
        this.cb(this.value);
    }
}

let vm = new Vue({
    data: {
        name: '张三',
        age: 18
    }
});
vm.name = '老四'
vm.name = '老五'
