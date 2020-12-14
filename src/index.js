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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUserDataForm = this.handleChangeUserDataForm.bind(this);
    this.handleEditUser = this.handleEditUser.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
  }

  componentDidMount() {
    const newState = JSON.parse(localStorage.getItem("newState"))
    this.setState(newState);
  }

  handleSubmit(event) {
    const { registeredUsers, registeredUsersLastIndex, userDataForm } = this.state;
    let newState = {};

    if (userDataForm.id == '') {
      const newId = registeredUsersLastIndex + 1;
      userDataForm.id = newId;
      const newUser = { ...userDataForm };
      newState.registeredUsers = [...registeredUsers, newUser];
      newState.registeredUsersLastIndex = newId;
    } else {
      const newRegisteredUsers = registeredUsers.map((user, i) => {
        if (user.id == userDataForm.id) {
          const oldId = user.id;
          userDataForm.id = oldId;
          user[i] = userDataForm;
          return user[i];
        }
        return user;
      });
      newState.registeredUsers = newRegisteredUsers;
    }
    newState.userDataForm = {
        name: '',
        sex: 'мужской',
        date: '',
        address: '',
        medicine: '',
        id: '',
    };
    var serialObjNewState = JSON.stringify(newState)
    localStorage.setItem('newState', serialObjNewState);
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
              submit={this.handleSubmit}
              change={this.handleChangeUserDataForm}
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
