import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import RegistrationForm from './RegistrationForm';
//import UserList from './UserList.js';

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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUserDataForm = this.handleChangeUserDataForm.bind(this);
    this.handleEditUser = this.handleEditUser.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { registeredUsers, registeredUsersLastIndex, userDataForm } = this.state;
    const { id } = userDataForm;

    if (userDataForm.id == '') {
      this.setState({registeredUsersLastIndex: registeredUsersLastIndex + 1});
      userDataForm.id = registeredUsersLastIndex + 1;
      this.setState({registeredUsers: [...registeredUsers, userDataForm ]});
    } else {
      const dataForEdit = registeredUsers.map((user, i) => {
        if (user.id == userDataForm.id) {
          const oldId = user.id;
          userDataForm.id = oldId;
          user[i] = userDataForm;
          return user[i];
        }
        return user;
      });
      this.setState({registeredUsers: [...dataForEdit ]});
    }

    this.setState({userDataForm: {
      name: '',
      sex: 'мужской',
      date: '',
      address: '',
      medicine: '',
      id: '',
    }});
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

      this.setState({userDataForm: {
        name: name,
        sex: sex,
        date: date,
        address: address,
        medicine: medicine,
        id: id,
      }});
  }

  handleDeleteUser(event) {
    const idUserForEdit = event.target.dataset.userId;
    const { registeredUsers, userDataForm } = this.state;
    const filterUsersById = registeredUsers.filter((el) => el['id'] != idUserForEdit);
    this.setState({registeredUsers: [...filterUsersById ]});
  }

  render() {
    const { searchData, registeredUsers } = this.state;
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
            <a href="#" name='edit' data-user-id={id} onClick={this.handleEditUser}>Редактировать</a>
            <a href="#" name='delete' data-user-id={id} onClick={this.handleDeleteUser}>удалить</a>
         </td>
         </tr>
       )
    });

    return(
      <div>
        <form className="userDataForm" onSubmit={this.handleSubmit}>
          <label for="name">ФИО</label>
          <input type="text" id="name" name="name"
            value={this.state.userDataForm.name}
            onChange={this.handleChangeUserDataForm}
            placeholder="Иванов Иван Иванович"/>

          <label for="sex">пол</label>
          <select id="sex" name="sex"
          value={this.state.userDataForm.sex}
          onChange={this.handleChangeUserDataForm}>
            <option>мужской</option>
            <option>женский</option>
          </select>

          <label for="date">Дата рождения</label>
          <input type="date" id="date" name="date"
          value={this.state.userDataForm.date}
          onChange={this.handleChangeUserDataForm}
          />

          <label for="address">Адрес</label>
          <input type="text" id="address" name="address"
          value={this.state.userDataForm.address}
          onChange={this.handleChangeUserDataForm}
          />

          <label for="medicine">Номер полиса ОМС</label>
          <input type="text" id="medicine" name="medicine"
            value={this.state.userDataForm.medicine}
            onChange={this.handleChangeUserDataForm}
            placeholder="00000000000"/>

          <input type='submit' value='Сохранить'/>
        </form>
        <form>
          <label for="search">Поиск</label>
          <input type="text" id="search" name="search"
            value={this.state.searchData}
            onChange={this.handleChange}
          />
        </form>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>ФИО</th>
              <th>Пол</th>
              <th>Дата рождения</th>
              <th>Адрес</th>
              <th>Номер полиса ОМС</th>
              <th>Действие</th>
            </tr>
           </thead>
           <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
