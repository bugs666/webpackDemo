// 数据劫持
function reactive(data) {
    return new Proxy(data, {
        get(target, p, receiver) {
            let res = Reflect.get(target, p, receiver);
            trackEffect(target, p)
            return res
        },
        set(target, p, newValue, receiver) {
            let res = Reflect.set(target, p, newValue, receiver);
            triggerEffect(target, p);
            return res;
        }
    })
}

// 当前正在处理的副作用
let activeEffect = null;
// 待处理的副作用
const effectStack = [];

// 副作用函数
function effect(executor) {
    const effectFn = () => {
        try {
            effectStack.push(effectFn)
            activeEffect = effectFn;
            return executor();
        } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
        }
    }
    effectFn();
    return effectFn;
}

const effectMap = new Map();

// 依赖收集
function trackEffect(target, key) {
    let targetEffectMap = effectMap.get(target) ?? new Map();
    effectMap.set(target, targetEffectMap);

    let _deps = targetEffectMap.get(key) ?? new Set();
    _deps.add(activeEffect);
    targetEffectMap.set(key, _deps);
    effectMap.set(target, targetEffectMap);
}

// 派发更新
function triggerEffect(target, key) {
    const targetEffectMap = effectMap.get(target);
    if (!targetEffectMap) {
        return;
    }
    let _deps = targetEffectMap.get(key);
    if (!_deps?.size) {
        return;
    }
    _deps.forEach(effectFn => !!effectFn && effectFn())
}

const data = reactive({
    name: '张三',
    age: 18
})

effect(() => {
    console.log(data.name)
})

data.name = '李四'
data.name = '王五'




