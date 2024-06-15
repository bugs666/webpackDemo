export interface Action<A, T> {
    type: A,
    payload?: Partial<T>
}

export type Reducer<A, T> = (state: T, action: Action<A, T>) => T

export const createStore = <A, T>(reducer: Reducer<A, T>, initState: T) => {
    // 事件队列
    const listeners: Function[] = [];
    // 共享状态
    let state = initState;

    // 状态返回
    const getState = () => {
        return state;
    }

    // 事件订阅
    const subscribe = (handle: Function) => {
        listeners.push(handle);
    }

    // 派发更新
    const dispatch = (action: Action<A, T>) => {
        state = reducer(state, action)
        listeners.forEach(h => h())
    }
    return {getState, dispatch, subscribe}
}

// @ts-ignore
// 状态数据块隔离
export const combineReducers = <A, T>(reducers: { [key: keyof T]: Reducer<A, Partial<T>> }): Reducer<A, T> => {
    return (state, action) => {
        const currentState = {} as T;
        Reflect.ownKeys(reducers).forEach(key => {
            let reducer = reducers[key];
            currentState[key] = reducer(state[key], action);
        })
        return currentState;
    }
}
