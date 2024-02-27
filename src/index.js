import React from 'react';
import {createRoot} from 'react-dom/client';
import './css/index.css';
import './css/lessTest.less';
import App from "@src/app";
// import '../css/sassTest.scss';

const showInfo = (info, time) => setTimeout(() => console.log(info), time);

const promise = new Promise((resolve) => {
    console.log('hello World');
    resolve([...('webpack'.split(''))]);
});
promise.then((res) => console.log(`hello ${res.join('')}`));

showInfo('hello world', 1000);

// alert('666');

console.log('测试hmr');

console.log('react', React);
// console.log('jquery', $);

createRoot(document.querySelector('#root')).render(<App/>);
