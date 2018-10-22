const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'room 1'
    }, {
      id: '2',
      name: 'Richard',
      room: 'room 2'
    }, {
      id: '3',
      name: 'Jen',
      room: 'room 1'
    }]
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'richard',
      room: 'office fans'
    }
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var user = users.removeUser('1');

    expect(user.id).toBe('1');
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var user = users.removeUser('12');

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var user = users.getUser('2');

    expect(user.id).toBe('2');
  });

  it('should not find user', () => {
    var user = users.getUser('14');

    expect(user).toNotExist();
  });

  it('should return names for room 1', () => {
    var userList = users.getUserList('room 1');

    expect(userList).toEqual(['Mike', 'Jen']);
  });

  it('should return names for room 2', () => {
    var userList = users.getUserList('room 2');

    expect(userList).toEqual(['Richard']);
  });
});
