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
      registeredUsers: [],
      searchData: '',
      registeredUsersLastIndex: 0,
      userDataForm: {
        name: '',
        sex: 'мужской',
        date: '',
        address: '',
        medicine: '',
        id: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);//сабмит сохраняет пользователя или изменяет если он уже существовал
    //в конце возвращает пустую форму для последующих добавлений
    this.handleChange = this.handleChange.bind(this);//все что вводится в поле сразу добавляется
    //в поле поиска в стейте
    this.handleChangeUserDataForm = this.handleChangeUserDataForm.bind(this);
    //при потере фокуса
    //данные из этого поля
    //должна сразу оказаться в стейте
    this.handleEditUser = this.handleEditUser.bind(this);//редактирование
    //вытаскивает из события ид юзера и находит этого юзера в данных
    //затем в каждое соответсвующее поле регистрации кладет данные юзера для последующего редактирования
    this.handleDeleteUser = this.handleDeleteUser.bind(this);//удаление
    //вытаскивает из события ид юзера и находит этого юзера в данных
    //затем фильтрует сохраненных юзеров и выводит список юзеров без этого юзера
  }

  componentDidMount() {
    const newState = JSON.parse(localStorage.getItem("newState"))
    this.setState(newState);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { registeredUsers, registeredUsersLastIndex, userDataForm } = this.state;
    let newState = {};

    const user = {
      name: userDataForm.name,
      birth_date: userDataForm.date,
      gender: userDataForm.sex,
      living_address: userDataForm.address,
      insurance_policy: userDataForm.medicine,
    };
    console.log('sdfgasgwar');

    fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' //'application/json;charset=utf-8'
        },
        body: user,
      }).then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });

    // if (userDataForm.id == '') {
    //   const newId = registeredUsersLastIndex + 1;
    //   userDataForm.id = newId;
    //   const newUser = { ...userDataForm };
    //   newState.registeredUsers = [...registeredUsers, newUser];
    //   newState.registeredUsersLastIndex = newId;
    // } else {
    //   const newRegisteredUsers = registeredUsers.map((user, i) => {
    //     if (user.id == userDataForm.id) {
    //       const oldId = user.id;
    //       userDataForm.id = oldId;
    //       user[i] = userDataForm;
    //       return user[i];
    //     }
    //     return user;
    //   });
      // newState.registeredUsers = newRegisteredUsers;
    // }
    newState.userDataForm = {
        name: '',
        sex: 'мужской',
        date: '',
        address: '',
        medicine: '',
        id: '',
    };
    //var serialObjNewState = JSON.stringify(newState)
    //localStorage.setItem('newState', serialObjNewState);
  }

  handleChange(event) {
    this.setState({ searchData: event.target.value })
  }

  handleChangeUserDataForm(event) {
    const oldDataForm = this.state.userDataForm;
    const { name, value } = event.target;
    const newState = { userDataForm: { ...oldDataForm, [name]: value } };
    this.setState(newState);
  }

  handleEditUser(event) {
    const idUserForEdit = event.target.dataset.userId;
    const { registeredUsers, userDataForm } = this.state;
    const filterUsersById = registeredUsers.filter((el) => el['id'] == idUserForEdit)[0];
    const { name, sex, date, address, medicine, id } = filterUsersById;

      this.setState({
        userDataForm: {
          name: name,
          sex: sex,
          date: date,
          address: address,
          medicine: medicine,
          id: id,
        }
      });
  }

  handleDeleteUser(event) {
    const idUserForEdit = event.target.dataset.userId;
    const { registeredUsers, userDataForm } = this.state;
    const filterUsersById = registeredUsers.filter((el) => el['id'] != idUserForEdit);
    this.setState({registeredUsers: [...filterUsersById ]});
  }

  render() {
    const { searchData, registeredUsers, userDataForm } = this.state;
    const filterUsers = registeredUsers.filter((el) => {
      const { name, sex, date, address, medicine } = el;
      return name.includes(searchData) ||
             sex.includes(searchData) ||
             date.includes(searchData) ||
             address.includes(searchData) ||
             medicine.includes(searchData);
    });

    const rows = filterUsers.map((el, i) => {
      const { name, sex, date, address, medicine, id } = el;
       return (
         <tr key={id}>
           <td>{i + 1}</td>
           <td>{name}</td>
           <td>{sex}</td>
           <td>{date}</td>
           <td>{address}</td>
           <td>{medicine}</td>
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
