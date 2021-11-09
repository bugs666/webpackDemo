import '../css/index.css';
import '../css/lessTest.less';
import React from 'react';
// import '../css/sassTest.scss';

const showInfo = (info, time) => setTimeout(() => console.log(info), time);

const promise = new Promise((resolve) => {
  console.log('hello World');
  resolve([...('webpack'.split(''))]);
});
promise.then((res) => console.log(`hello ${res.join('')}`));

showInfo('hello world', 1000);

alert('666');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}
