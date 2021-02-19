const createNewUser = async () => {
  const data = {
    name: "Ivan",
    birthDate: "2000-04-11",
    gender: "m",
    livingAddress: "Nave 156, 4",
    insurancePolicy: "1234567891012345"
  }
  const params = new URLSearchParams(data);

  const response = await fetch(`/users?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: '{}'
  });

  return await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.createUser');
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const newUser = await createNewUser();
    console.log(newUser);
  })
});
