var express = require('express');
var router = express.Router();
const db = require('../db');
const validateParams = require('../extraFunction/validate.js');
const dayjs = require('dayjs');

// GET /users/ - получить все +
// GET /users/:id - получить один +
// POST /users/ - создать еще один +
// PUT /users/:id - изменить какой-то+
// DELETE /users/:id - удалить какой-то один+ add
//GET search  -  поиск по введенным данным

// GET /users/ - получить все +
const getUsers = async (searchData = '') => {
  let searchStr;
  if (searchData) {
    const state =`
      SELECT * FROM users WHERE name ILIKE '${searchData}%' ORDER BY id
    `;
    searchStr = await db.query(state);
  } else {
    searchStr = await db.query('SELECT * FROM users ORDER BY id');
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

  const searchStrMap = await Promise.all(data.map(async (el) => {
        const elForFormatting = await el;
        const newEl = {
          ...elForFormatting,
          birth_date: dayjs(elForFormatting.birth_date).format('YYYY-MM-DD')
        }
        return newEl;
      }));
  res.json(searchStrMap);
});
//====================================================

// POST /users/ - создать еще один +
const createUser = async (data) => {
  const state = `
  INSERT INTO users(name, birth_date, gender, living_address, insurance_policy)
  VALUES($[name], $[birth_date], $[gender], $[living_address], $[insurance_policy])
  RETURNING id
  `;

  const { id } = await db.query(state, data);
  return { id, ...data };
};

const  checkUserInBd = async (data) => {
  const state =`
    SELECT * FROM users WHERE insurance_policy ILIKE '${data}%' ORDER BY id
  `;
  searchUser = await db.query(state);
  return searchUser;
};

router.post('/', async (req, res, next) => {
  const data = req.body;

  const errors = validateParams(data);
  if (errors.length > 0) {
   res.status(200);
   res.json({ errors: errors });
   return;
  }

  const checkUser = await checkUserInBd(req.body.insurance_policy);
  console.log('checkUser');
  console.log(checkUser);

  if(checkUser.length > 0) {
    res.status(200);
    res.json('User exist');
    return;
  }

  const newUser = await createUser(data); //{ name: '', date: '' };
  res.status(201);
  res.json(newUser);
});

//=======================================================================

// PUT /users/:id - изменить какой-то +
const  findById = async (userId) => {
  const state = `
    SELECT id FROM users WHERE id = ${userId}
  `;
  const { id } = await db.query(state);
  return id;
};

const updateUser = async (data) => {
  const state = `
    UPDATE users SET name = $[name], birth_date = $[birth_date], gender = $[gender],
    living_address = $[living_address], insurance_policy = $[insurance_policy]
    WHERE id = $[id];
  `;

  await db.query(state, data);
  return { ...data };
};

router.put('/:id', async (req, res, next) => {
  const data = req.body;// {name: jio }

  const { id } = req.params; // 34

  const checkIdAtBd =  await findById(id);

  if(!checkIdAtBd) {
    res.status(200);
    res.json('User not exist');
    return;
  }

  const errors = validateParams(data);
  console.log('errors');
  console.log(errors);
  if (errors.length > 0) {
   res.status(200);
   res.json({ errors: errors });
   return;
  }

  const newUser = await updateUser(data); //{ name: '', date: '' };
  res.status(200);
  res.json(newUser);
});

//=======================================================================

// DELETE /users/:id
const deleteById = async (data) => {
  const state = `
    DELETE FROM users WHERE id = ${data} RETURNING name;
  `;

  const user = await db.query(state);
  return user;
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
  res.json(deleteUser);
})
//=======================================================================

module.exports = router;
