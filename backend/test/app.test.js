const request = require('supertest');
const app = require('../app');
const db = require('../db');
const dayjs = require('dayjs');
const pgp = require('pg-promise')();

const clearDatabase = async () => {
  const clearDb = db.none('TRUNCATE users');
  return clearDb;
}

afterEach(async () => {//после каждого теста удалить все данные из таблицы бд
  await clearDatabase();
});


//тест на добавление в бд инф об юзере(POST /users/ - создать еще один)
describe('POST /users', function () {
  it('add user to db', async () => {
    const user = {
      name: "weq",
      birth_date: "1994-01-27",
      gender: "f",
      living_address: "ghghg",
      insurance_policy: "8664595891057345"
    };

    await request(app)
      .post(`/users/`)
      .send(user)
      .expect(201);
    const result = await db.one('SELECT name, birth_date, gender, living_address, insurance_policy  FROM users ORDER BY id DESC LIMIT 1');

    const expected = {
      name: result.name,
      birth_date: dayjs(result.birth_date).format('YYYY-MM-DD'),
      gender: result.gender,
      living_address: result.living_address,
      insurance_policy: result.insurance_policy,
    }
    expect(expected).toEqual(user);

  });
});
//===================================================================================

//GET  - получить всех пользователей из бд
describe('GET /users', function () {
  it('get all users from db', async () => {

    const user = {
      name: "Sam",
      birth_date: "1961-06-16",
      gender: "m",
      living_address: "tekstilshika 45, 5",
      insurance_policy: "8664595891057345"
    };

    const state = `
      INSERT INTO users (name, birth_date, gender, living_address, insurance_policy)
      VALUES ($[name], $[birth_date], $[gender], $[living_address], $[insurance_policy]);
    `;

    const addUser = db.none(state, user);

    const result = await request(app)
      .get(`/users`)
      .expect(200);

    const resultFromArray = result.body[0];

    const expected = {
      name: resultFromArray.name,
      birth_date: dayjs(resultFromArray.birth_date).format('YYYY-MM-DD'),
      gender: resultFromArray.gender,
      living_address: resultFromArray.living_address,
      insurance_policy: resultFromArray.insurance_policy,
    }

    expect(expected).toEqual(user);

  });
});

//======================================================


// PUT /users/:id - изменить какой-то
describe('PUT /users/:id', function() {
  it('update user in db by id', async () => {
    const user = {
      name: "Darvin",
      birth_date: "1950-10-04",
      gender: "m",
      living_address: "earth 5, 4",
      insurance_policy: "8664000893057345",
    };

    const state = `
      INSERT INTO users (name, birth_date, gender, living_address, insurance_policy)
      VALUES ($[name], $[birth_date], $[gender], $[living_address], $[insurance_policy]) RETURNING id;
    `;

    const { id } = await db.one(state, user);

    const updateUser = {
      id: id,
      name: "Anatoli",
      birth_date: "1950-03-04",
      gender: "m",
      living_address: "earth 5, 4",
      insurance_policy: "8664000893057345",
    };

    await request(app)
      .put(`/users/${id}`)
      .send(updateUser)
      .expect(200);
    const result = await db.one('SELECT *  FROM users ORDER BY id DESC LIMIT 1');

    const expected = {
      ...result,
      birth_date: dayjs(result.birth_date).format('YYYY-MM-DD')
    };

    expect(expected).toEqual(updateUser);
  });
});
//=======================================================

//тест на удаление пользователя из бд
describe('DELETE users/:id', function() {
  it('delete user from db by id', async () => {
    const user = {
      name: "Darvin",
      birth_date: "1950-10-04",
      gender: "m",
      living_address: "earth 5, 4",
      insurance_policy: "8664000893057345",
    };

    const state = `
      INSERT INTO users (name, birth_date, gender, living_address, insurance_policy)
      VALUES ($[name], $[birth_date], $[gender], $[living_address], $[insurance_policy]) RETURNING id;
    `;

    const { id } = await db.one(state, user);
    const { name } = await db.one(`SELECT name  FROM users WHERE id = ${id}`);

    const result = await request(app)
      .delete(`/users/${id}`)
      .expect(200);

    const expected = result.body;

    expect(expected.user).toEqual(`user ${name} delete`);
  });
});
//====================================================================

// тест на поиск пользователя
describe('GET some /users', function () {
  it('search users in db', async () => {
    const userOne = {
      name: "Darvin",
      birth_date: "1950-10-04",
      gender: "m",
      living_address: "earth 5, 4",
      insurance_policy: "8664000893057345",
    };
    const userTwo = {
      name: "weq",
      birth_date: "1994-01-27",
      gender: "f",
      living_address: "ghghg",
      insurance_policy: "8664595891057345"
    };

    const cs = new pgp.helpers.ColumnSet(['name', 'birth_date', 'gender', 'living_address', 'insurance_policy'], {table: 'users'});

    const state = pgp.helpers.insert([userOne, userTwo], cs);

    await db.none(state);

    const result = await request(app)
      .get(`/users`)
      .query({ name: userTwo.name })
      .expect(200);

    const expected = result.body.map((el) => {
      return {
        name: el.name,
        birth_date: dayjs(el.birth_date).format('YYYY-MM-DD'),
        gender: el.gender,
        living_address: el.living_address,
        insurance_policy: el.insurance_policy,
      }
    })

    expect(expected).toEqual([userTwo]);

  });
});
//====================================================================
