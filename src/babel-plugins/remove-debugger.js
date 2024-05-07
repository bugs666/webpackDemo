const visitor = {
    // 根据AST来处理需要编译的代码
    // https://astexplorer.net/
    // https://juejin.cn/post/7354936709753716799?searchId=2024050721460392C2C262BE43D6C72401#heading-5
    DebuggerStatement(path, state) {
        if (state.opts.debugger) {
            path.remove();
        }
    }
}

module.exports = function () {
    return {
        visitor
    }
}
