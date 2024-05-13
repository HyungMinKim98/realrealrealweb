import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import './RightMenu.css';

function RightMenu(props) {
  const user = useSelector(state => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push('/login');
      } else {
        alert('Log Out Failed');
      }
    });
  };

  if (user.userData && user.userData.isAuth) { // 로그인 한 사용자가 보는 페이지
    return (
      <Menu mode={props.mode} className="right-menu">
        <Menu.Item key="upload" className="menu-item">
          <a href="/diary/upload">다이어리 작성</a>
        </Menu.Item>
        <Menu.Item key="userName" className="menu-item menu-item-user-name">
          <Link to="/user">{user.userData.name}</Link> {/* 유저 이름 클릭 시 UserPage로 이동 */}
        </Menu.Item>
        <Menu.Item key="logout" className="menu-item">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  } else { // 로그인 안 한 사용자가 보는 페이지
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">로그인</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">회원가입</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
