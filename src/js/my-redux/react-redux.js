import React, {Component, createContext, useContext, useEffect, useState} from "react";

let cxt = createContext({});
const {Consumer, Provider} = cxt;

const connect = (mapStateToProps, mapDisPatchToProps) => (Comp) => {
    return (props) => {
        const _store = useContext(cxt);
        const [, setUpdate] = useState(false);
        useEffect(() => {
            _store.subscribe(() => {
                // 强制更新
                setUpdate(u => !u)
            })
        }, []);

        return <Consumer>
            {
                store => {
                    const newProps = {
                        ...props,
                        ...mapStateToProps(store.getState()),
                        ...mapDisPatchToProps(store.dispatch)
                    }
                    return <Comp {...newProps}></Comp>
                }
            }
        </Consumer>
    }
}

export {
    Provider,
    connect
}
