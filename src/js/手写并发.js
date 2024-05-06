class TaskPool {
    static pool = null

    constructor(max = 6) {
        // 最大并发数
        this.max = max;
        // 当前正在执行的任务数量
        this.taskCount = 0;
        // 任务队列
        this.taskQueue = [];
    }

    run(caller) {
        return new Promise((resolve, reject) => {
            const task = this.createTask(caller, resolve, reject)
            // 如果当前任务数量小于最大并发数，则直接执行任务
            if (this.taskCount >= this.max) {
                this.taskQueue.push(task);
            } else {
                task();
            }
            this.taskCount++;
        });
    }

    createTask(...rest) {
        const [caller, resolve, reject] = rest;
        return () => {
            return caller.then(resolve).catch(reject).finally(() => {
                this.taskCount--;
                // 如果当前待执行任务队列中有任务，取出首个任务并执行
                if (this.taskQueue.length) {
                    (this.taskQueue.shift())()
                }
            })
        }
    }

    // 创建任务池实例，默认最大并发数为6
    static createPool(max) {
        this.pool = this.pool || new TaskPool(max);
        return this.pool;
    }
}

let pool = TaskPool.createPool(3);

Array(12).fill().map((_, index) => {
    const random = Math.floor(Math.random() * 10) * 1000
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`任务${index + 1} 执行完毕~耗时：${random}`)
            resolve(index)
        }, random)
    })
}).forEach(task => {
    pool.run(task);
})
