import React, {useEffect, useRef, useState} from "react";
import {Action, combineReducers, createStore} from "../../js/my-redux";
import {connect, Provider} from "../../js/my-redux/react-redux";

const initData = {
    age: 18,
    name: '张三'
}

enum ActionType {
    grow = 'AGE_ACTION',
    minus = 'MINUS_ACTION',
    name = 'NAME_ACTION'

}

type StateType = typeof initData;
const ageReducer = (state: number, action: Action<ActionType, number>) => {
    const {type} = action;
    switch (type) {
        case ActionType.grow:
            return state + 1
        case ActionType.minus: {
            if (state === 1) {
                return state;
            }
            return state - 1;
        }
        default:
            return state;
    }
}
const nameReducer = (state: string, action: Action<ActionType, string>) => {
    const {type, payload} = action;
    switch (type) {
        case 'NAME_ACTION':
            return payload
        default:
            return state;
    }
}
let reducer = combineReducers<ActionType, StateType>({age: ageReducer, name: nameReducer});

const store = createStore<ActionType, StateType>(reducer, initData);
export const ReduxTest = () => {
    let [info, setInfo] = useState<StateType>(initData);

    useEffect(() => {
        store.subscribe(() => {
            let currentInfo = store.getState();
            setInfo(currentInfo)
        })
    }, []);

    return <Provider value={store}>
        <Data/>
        <ChangeData/>
    </Provider>
}

const Data = () => {
    const info = store.getState();
    return <>
        <h1>姓名：{info.name}</h1>
        <h1>年龄:{info.age}</h1>
    </>
}

const DataChange = (props) => {
    const currentInfo = store.getState();
    const inputRef = useRef(null);
    return <>
        <>
            <input ref={inputRef}/>
            <button onClick={() => {
                props.changeName(inputRef.current.value || currentInfo.name);
            }}>改名字
            </button>
        </>
        <button onClick={() => {
            props.grow();
        }}>长大一岁
        </button>
        <button disabled={currentInfo.age === 1} onClick={() => {
            props.minus();
        }}>返老还童
        </button>
    </>
}
const mapStateToProps = (state: StateType) => ({
    userInfo: state
});
const mapDisPatchToProps = (dispatch: (action: Action<ActionType, StateType>) => void) => {
    return {
        grow: () => dispatch({type: ActionType.grow}),
        minus: () => dispatch({type: ActionType.minus}),
        // @ts-ignore
        changeName: (name: string) => dispatch({type: ActionType.name, payload: name})
    }
}
const ChangeData = connect(mapStateToProps, mapDisPatchToProps)(DataChange);
