import '../css/index.css';
import '../css/lessTest.less';
// import '../css/sassTest.scss';

const showInfo = (info, time) => setTimeout(() => console.log(info), time);

const promise = new Promise((resolve) => {
  console.log('hello World');
  resolve([...('webpack'.split(''))]);
});
promise.then((res) => console.log(`hello ${res.join('')}`));

showInfo('hello world', 1000);
