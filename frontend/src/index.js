import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import RegistrationForm from './RegistrationForm.js';
import UsersList from './UsersList.js';
import SearchUsers from './SearchUsers.js';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registeredUsers: [], //зареганные юзеры
      searchData: '', //строка поиска
      userDataForm: { //форма для сабмита
        name: '',
        sex: 'm',
        date: '',
        address: '',
        medicine: '',
        id: '',//из бд, вычисляется автоматически, изначально отсутствует
        errors: {//добавила для валидации, не знаю как сделать проще пока так
          name: '',
          sex: '',
          date: '',
          address: '',
          medicine: '',
        },
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);//сабмит сохраняет пользователя или изменяет если он уже существовал
    //в конце возвращает пустую форму для последующих добавлений 1
    this.handleChange = this.handleChange.bind(this);//все что вводится в поле сразу + в поле поиска в стейте 2
    this.handleChangeUserDataForm = this.handleChangeUserDataForm.bind(this);
    //при потере фокуса 3
    //данные из этого поля
    //должна сразу оказаться в стейте
    this.handleEditUser = this.handleEditUser.bind(this);//редактирование 4
    //вытаскивает из события ид юзера кладет юзера в стейт для последующего редактирования
    this.handleDeleteUser = this.handleDeleteUser.bind(this);//удаление 5
    //вытаскивает из события ид юзера удаляет в бд, фильтрует сохраненных юзеров и выводит обновленный список
  }

  componentDidMount() {
    fetch('/users').then(res => res.json()).then(data => {
      this.setState({
        registeredUsers: [...data],
        searchData: this.state.searchData,//если что-то было в поиске то занести сюда если нет надо внести ''
        userDataForm: {
          name: '',
          sex: 'm',
          date: '',
          address: '',
          medicine: '',
          id: '',
          errors: {
            name: '',
            sex: '',
            date: '',
            address: '',
            medicine: '',
          },
        },
      });
    }).catch((e) => console.log('some error', e));
  }

  handleSubmit(event) {//сабмит формы
    const { registeredUsers, userDataForm } = this.state;

    const user = {
      name: userDataForm.name,
      birth_date: userDataForm.date,
      gender: userDataForm.sex,
      living_address: userDataForm.address,
      insurance_policy: userDataForm.medicine,
      id: userDataForm.id,
    };

    let status = function (response) {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText))
      }
      return Promise.resolve(response)
    }
    let json = function (response) {
      return response.json()
    }

    if (userDataForm.id == '') {//если ид ne существует то запрос пост
        fetch('/users', {
            method: 'POST',
            headers: {
              'Content-Type':  'application/json'
            },
            body: JSON.stringify(user),
          })
            .then(status)
            .then(json)
            .then(() => {
              let arr = [];
              for (const [key, value] of Object.entries(this.state.userDataForm)) {
                arr = [...arr, `${key}: ${value}`];
              }
              return arr.join('\n');
            })
            .then((str) => {
              alert(`Пациент ${str} зарегистрирован`);
            })
            .catch((error) => {
              return error.map(({ msg, param }) => {
                this.setState({
                  userDataForm: {
                    errors: {
                      [param]: msg,
                    },
                  },
                });
              });
              console.log('error', error)
            });
    } else {//если ид существует то запрос путi на изменение юзера
          fetch(`/users/${userDataForm.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type':  'application/json'
              },
              body: JSON.stringify(user),
            }).then((response) => {
              return response.json();
            }).then((data) => {
              let arr = [];
              for (const [key, value] of Object.entries(data)) {
                arr = [...arr, `${key}: ${value}`];
              }
              return arr.join('\n');
            }).then((str) => {
              alert(`Пациент ${str} изменен`);
            }).catch((e) => console.log('some error', e));
       };

         fetch('/users').then(res => res.json()).then(data => {
           this.setState({
             registeredUsers: [...data],
             searchData: this.state.searchData,//если что-то было в поиске то занести сюда если нет надо внести ''
             userDataForm: {
               name: '',
               sex: 'm',
               date: '',
               address: '',
               medicine: '',
               id: '',
               errors: {
                 name: '',
                 sex: '',
                 date: '',
                 address: '',
                 medicine: '',
               },
             },
           });
         }).catch((e) => console.log('some error', e));

  }

  handleChange(event) {
    this.setState({ searchData: event.target.value }, async () => {
      let { searchData } = this.state;

      fetch(`/users?name=${searchData}`).then(res => res.json()).then(data => {
        console.log(data);
        this.setState({
          registeredUsers: [...data],
          searchData: searchData,
        });
      }).catch((e) => console.log('some error', e));
    }) // внесли в стейт
    //все что вводится в поле сразу добавляется
    //в поле поиска в стейте
  }

  handleChangeUserDataForm(event) {
    //при потере фокуса
    //данные из этого поля
    //должна сразу оказаться в стейте
    const oldDataForm = this.state.userDataForm;
    const { name, value } = event.target;
    const newState = { userDataForm: { ...oldDataForm, [name]: value } };
    this.setState(newState);
  }

  handleEditUser(event) {
    //редактирование
    //вытаскивает из события ид юзера и помещает этого юзера в форму для редактирования
    const idUserForEdit = event.target.dataset.userId;
    const { registeredUsers, userDataForm } = this.state;
    //надо отфильтровать юзера и одного поместить в форму для последующего сабмита

    const filterUsersById = registeredUsers.filter((el) => el['id'] == idUserForEdit)[0];
    const { name, birth_date, gender, living_address, insurance_policy, id } = filterUsersById;
      this.setState({
        userDataForm: {
          name: name,
          sex: gender,
          date: birth_date,
          address: living_address,
          medicine: insurance_policy,
          id: id,
        }
      });
  }

  handleDeleteUser(event) {
    //удаление
    const idUserForEdit = event.target.dataset.userId;

    fetch(`/users/${idUserForEdit}`, {
        method: 'DELETE',
        headers: {
          'Content-Type':  'application/json'
        },
      }).then((response) => {
        return response.json();
      }).then((data) => {
        let arr = [];
        for (const [key, value] of Object.entries(data)) {
          arr = [...arr, `${key}: ${value}`];
        }
        return arr.join('; ');
      }).then((str) => {
        alert(`Пациент ${str} удален`);
      });

    const { registeredUsers } = this.state;
    const filterUsersById = registeredUsers.filter((el) => el['id'] != idUserForEdit);
    this.setState({registeredUsers: [...filterUsersById ]});
  }

  render() {
    const { searchData, registeredUsers, userDataForm } = this.state;

    const rows = registeredUsers.map((el, i) => {
      const { name, birth_date, gender, living_address, insurance_policy, id } = el;
       return (
         <tr key={id}>
           <td>{i + 1}</td>
           <td>{name}</td>
           <td>{birth_date}</td>
           <td>{gender}</td>
           <td>{living_address}</td>
           <td>{insurance_policy}</td>
           <td>
              <a href="#" name='edit' data-user-id={id} onClick={this.handleEditUser}>Редактировать &nbsp;</a>
              <a href="#" name='delete' data-user-id={id} onClick={this.handleDeleteUser}>Удалить</a>
           </td>
         </tr>
       )
    });

    return(
      <div class="container-fluid">
        <div class='row'>
          <div class='col-3'>
            <h2>Регистрация</h2>
            <RegistrationForm value={this.state.userDataForm}
              submit={this.handleSubmit}//регистрация
              change={this.handleChangeUserDataForm}//срабатывает при потере фокуса
            />
          </div>
          <div class='col-9'>
            <h2>Зарегистрированные пользователи</h2>
            <SearchUsers value={this.state.searchData} change={this.handleChange}/>
            <UsersList rows={rows}/>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
