var factory = require('./factory');
factory.setRoot([__dirname, 'test'].join('/'));


var test1 = factory.get('test', {id: 1});
var test2 = factory.get('test', {id: 2});
var test3 = factory.get('test', {name: 'hello'});

console.log('test1.is(test)', test1.is('test'));
console.log('test2.is(test)', test2.is('test'));
console.log('test3.is(test)', test3.is('test'));

console.log('test1', '\n   get', test1.get(), '\n   modified', test1.modified(), '\n   initial', test1.initial());
console.log('test2', '\n   get', test2.get(), '\n   modified', test2.modified(), '\n   initial', test2.initial());
console.log('test3', '\n   get', test3.get(), '\n   modified', test3.modified(), '\n   initial', test3.initial());