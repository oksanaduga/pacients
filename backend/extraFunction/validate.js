const validateParams = function(data) {
  const errors = [];
  let today = new Date();

  if (!(Date.parse(today) > Date.parse(data.birth_date))) { //если дата меньше чем дата рожд - ошибка
    //(пустая строка при сравнении с сегодняшней датой всегда вернет false)
    //проблема - просто число при сравнении дает нормальный результат
    errors.push('wrong date. please try 1999-01-01 format');
  }
  if (data.gender !== 'm' && data.gender !== 'f') {
    errors.push('wrong gender. please try "m" or "f"');
  }
  if (data.insurance_policy && data.insurance_policy.length !== 11) {
    errors.push('wrong insurancePolicy. Should contains 16 digits');
  }
  return errors.length > 0 ? errors.join(', ') : [];
};

module.exports = validateParams;
