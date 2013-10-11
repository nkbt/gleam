var factory = require('./factory');
factory.setRoot([__dirname, 'test'].join('/'));


var test1 = factory.get('test', {id: 1});
var test2 = factory.get('test', {id: 2});
var test3 = factory.get('test', {name: 'hello'});

console.log(test1.is('test'));

console.log(test1.get());
console.log(test2.get());
console.log(test3.get());

return;
var Entity = require('./entity').Entity;

function UserEntity(data) {
	var schema = {
		id: null,
		name: null,
		timestamp: null
	};
	return new Entity('user', schema, data);
}


var user1 = new UserEntity({id: 4, name: 'xxx', hello: 'World'});
console.log('user1', user1);
user1.set('id', 1);
console.log('user1', '\n   ', user1.get(), '\n   ', user1.modified(), '\n   ', user1.initial());

var user2 = new UserEntity({id: 5, name: 'yyy', timestamp: (new Date).getTime()});
user2.set('id', 2);
user2.set('xxx', 'yyy');

console.log('user2', '\n   ', user2.get(), '\n   ', user2.modified(), '\n   ', user1.initial());


console.log(user2.getTimestamp());
console.log(user2.getId());