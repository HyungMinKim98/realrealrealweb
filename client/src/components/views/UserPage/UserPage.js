// src/pages/UserPage/UserPage.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './UserPage.css';

const UserPage = () => {
  const [user, setUser] = useState({
    nickname: '',
    gender: '',
    birthYear: '',
    genre: [],
    profilePhoto: ''
  });
  const history = useHistory();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/auth');
      if (response.status === 200 && response.data.isAuth) {
        const userData = response.data;
        setUser({
          nickname: userData.name,
          gender: userData.gender || 'N/A',
          birthYear: userData.birthYear || 'N/A',
          genre: userData.genre || [],
          profilePhoto: userData.image || ''
        });
      } else {
        history.push('/login');
      }
    } catch (err) {
      console.error('프로필 가져오기 실패:', err);
      history.push('/login');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    history.push('/edit-profile');
  };

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="user-header">
          <h1>{user.nickname}님의 프로필</h1>
          <p>당신의 관심사와 프로필을 관리하세요.</p>
        </div>

        <div className="profile-section">
          <h2 className="profile-title">프로필 정보</h2>
          <div className="profile-info">
            <div className="profile-pic-container">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="profile-pic" />
              ) : (
                <div className="default-profile-pic">
                  <i className="fas fa-user-circle"></i>
                </div>
              )}
            </div>
            <div className="user-info">
              <p><strong>이름:</strong> {user.nickname}</p>
              <p><strong>성별:</strong> {user.gender}</p>
              <p><strong>태어난 해:</strong> {user.birthYear}</p>
              <p><strong>장르:</strong> {user.genre.join(', ')}</p>
              <button onClick={handleEditProfile} className="edit-button">프로필 수정</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;