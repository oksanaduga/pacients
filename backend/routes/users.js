var express = require('express');
var router = express.Router();
const db = require('../db');

// GET /users/ - получить все +
// GET /users/:id - получить один +
// POST /users/ - создать еще один +
// PUT /users/:id - изменить какой-то+
// DELETE /users/:id - удалить какой-то один+
//GET search  -  поиск по введенным данным

// GET /users/ - получить все +
const getUsers = async (searchData = '') => {
  let searchStr;
  if (searchData) {
    const state =`
      SELECT * FROM users WHERE name LIKE '${searchData}%'
    `;
    searchStr = await db.any(state);
  } else {
    searchStr = await db.any('SELECT * FROM users');
  }
  return searchStr;
};

// GET /users?q=asdf

router.get('/', async (req, res, next) => {
  let data;
  if (Object.keys(req.query).length === 0) {
    data = await getUsers();
  } else {
    const searchParams = req.query.name;
    data = await getUsers(searchParams);
  }
  res.json(data);
  next();
});
//====================================================


// POST /users/ - создать еще один +
const validateParams = (data) => {
  const errors = [];

  if (Date.parse(data.birthDate) < 0) {
    errors.push('wrong date. please try 1999-01-01 format');
  }
  if (data.gender !== 'm' && data.gender !== 'f') {
    errors.push('wrong gender. please try "m" or "f"');
  }
  if (data.insurancePolicy && data.insurancePolicy.length !== 16) {
    errors.push('wrong insurancePolicy. Should contains 16 digits');
  }
  return errors.length > 0 ? errors.join(', ') : [];
};

const createUser = async (data) => {
  const state = `
  INSERT INTO users(name, birth_date, gender, living_address, insurance_policy)
  VALUES($[name], $[birth_date], $[gender], $[living_address], $[insurance_policy])
  RETURNING id
  `;

  const { id } = await db.one(state, data);
  return { id, ...data };
};

router.post('/', async (req, res, next) => {
  const data = req.body;
  console.log('req.body', req.body);
  const result = validateParams(data);
  if(result.errors) {
   res.status(400);
   res.render('error');
   return;
 }
 const newUser = await createUser(data); //{ name: '', date: '' };
 res.status(201);
 //res.json(newUser);
 res.json({ user: newUser });
});

//=======================================================================

// PUT /users/:id - изменить какой-то +
//нужно провалидировать+
//если не проходит валидацию ошибка+
//если все ок далее+
//затем проверить есть ли такой ид в бд+
//если нет такого пользователя то вернуть ошибку с описанием+
//если все ок далее+
//внести новые данные об этом пользователе в бд+
const  findById = async (userId) => {
  const state = `
    SELECT id FROM users WHERE id = ${userId}
  `;
  const { id } = await db.one(state);
  return id;
};

const updateUser = async (data) => {
  const state = `
    UPDATE users SET name = $[name], birth_date = $[birth_date], gender = $[gender],
    living_address = $[living_address], insurance_policy = $[insurance_policy]
    WHERE id = $[id];
  `;

  await db.none(state, data);
  return { ...data };
};

router.put('/:id', async (req, res, next) => {
  const data = req.body;// {name: jio }

  const { id } = req.params; // 34

  const checkIdAtBd =  await findById(id);

  if(!checkIdAtBd) {
   res.status(404);
   res.render('error: user does not exist');
   return;
  }

  const result = await validateParams(data);
  if(result.errors) {
   res.status(400);
   res.render('error');
   return;
  }

  const newUser = await updateUser(data); //{ name: '', date: '' };
  res.status(200);
  res.json({ user: newUser });
  next();
});

//=======================================================================

// DELETE /users/:id - удалить какой-то один+
//взять из бд по ид и удалить
//вывести список без удаленного пользователя
const deleteById = async (data) => {
  const state = `
    DELETE FROM users WHERE id = ${data} RETURNING name;
  `;

  const userName = await db.one(state);

  return `user ${ userName.name } delete`;
};

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;//5
  const checkIdAtBd =  await findById(id);

  if(!checkIdAtBd) {
   res.status(404);
   res.render('error: user does not exist');
   return;
  }
  const deleteUser = await deleteById(id);
  res.status(200);
  res.json({ user: deleteUser });
  next();
})
//=======================================================================

module.exports = router;


//в какой момент происходит запрос - когда нажата кнопка сохранить и срабатывает функция привязанная к кнопке
//кто посылает запрос - функция привязанная к кнопке сохранить
//что он делает с этими данными - данные сохраняются в бд, сразу извлекаются из нее и выводятся на экран с кнопками изменить удалить
//что делает приложение - позволяет зарегистрировать пользователя, хранит данные
//о зарегистрированных пользователях, выводит их на экран, позволяет отредактировать и удалить эти данные
//и зачем нужны эти запросы - чтобы отобразить информацию о зарегистрированных пользователях на экране
//и позволить отредактировать или удалить информацию
