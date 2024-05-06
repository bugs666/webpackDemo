const getData = function () {
    return new Promise((resolve, reject) => {
        // 异步操作
        setTimeout(() => {
            resolve(Date.now());
        }, 1000);
    });
}

function* getAllData() {
    for (let i = 0; i < 5; i++) {
        let data = yield getData();
        console.log(`第${i + 1}次获取数据: ${data}`);
    }
}

function run(generator) {
    const gen = generator();
    const next = (data) => {
        const nextValue = gen.next(data);
        if (nextValue.done) return;
        nextValue.value.then(next);
    }
    next();
}

run(getAllData);
