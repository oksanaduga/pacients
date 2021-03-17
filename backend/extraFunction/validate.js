const validateParams = function(data) {
  let errors = [];
  let today = new Date();
  let regexpGender = /^([а-яё\s\d]+|[a-z\s\d])$/iu;
  let regexpName = /^([а-яё\s]+|[a-z\s]+)$/iu;
  let regexpAdress = /^([а-яё\s\d]+|[a-z\s\d])$/iu;

  if (!(Date.parse(today) > Date.parse(data.birth_date))) { //если дата меньше чем дата рожд - ошибка
    //(пустая строка при сравнении с сегодняшней датой всегда вернет false)
    //проблема - просто число при сравнении дает нормальный результат
    errors = [ ...errors, { param: 'birth_date', msg: 'Wrong date. please try 1999-01-01 format', }];
  }
  if (data.gender.length !== 1 || !(regexpGender.test(data.gender))) {
    errors = [ ...errors, { param: 'gender', msg: 'Wrong gender. please try "m" or "f"', }];
  }
  if (data.insurance_policy.length !== 16) {
    errors = [ ...errors, { param: 'insurance_policy', msg: 'Wrong insurancePolicy. Should contains 16 digits', }];
  }
  if (!(regexpAdress.test(data.living_address)) || data.living_address.length < 6) {
    errors = [ ...errors, { param: 'living_address', msg: 'Should contains 7 sumbols rus or en alphabet and digits', }];
  }
  if (!(regexpName.test(data.name)) || data.name.length < 6) {
    errors = [ ...errors, { param: 'name', msg: 'Should contains 7 sumbols rus or en alphabet', }];
  }

  return errors;
};

module.exports = validateParams;
