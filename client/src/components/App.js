
import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import DiaryUploadPage from './views/DiaryUploadPage/DiaryUploadPage';
import DetailDiaryPage from './views/DetailDiaryPage/DetailDiaryPage'
import DiaryEditPage from './views/DiaryEditPage/DiaryEditPage';
import UserPage from './views/UserPage/UserPage';
import EditProfilePage from './views/UserPage/EditProfilePage';
import DetailPage from './views/DetailPage/DetailPage';
import CalendarPage from './views/CalenderPage/CalenderPage';

// null: 누구나 접근 가능
// true: 로그인한 사용자만 접근 가능
// false: 로그인한 사용자는 접근 불가

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/user" component={Auth(UserPage, true)} />
          <Route exact path="/edit-profile" component={Auth(EditProfilePage, true)} />
          <Route exact path="/diary/upload" component={Auth(DiaryUploadPage, true)} />
          <Route exact path="/diary/:diaryId" component={Auth(DetailDiaryPage, null)} />
          <Route exact path="/diary/edit/:diaryId" component={Auth(DiaryEditPage, true)} />
          <Route exact path="/detail/:type/:id" component={Auth(DetailPage, null)} />
          <Route exact path="/calender" component={Auth(CalendarPage, null)} />

        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
