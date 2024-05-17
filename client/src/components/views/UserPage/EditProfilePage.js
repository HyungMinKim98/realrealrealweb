// src/pages/EditProfilePage/EditProfilePage.js

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './EditProfilePage.css';
import { GenderOptions, GenreOptions } from '../DiaryEditPage/Options';

const EditProfilePage = () => {
  const [user, setUser] = useState({
    nickname: '',
    gender: '',
    birthYear: '',
    genre: [],
    profilePhoto: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');  // 이미지 미리보기를 위한 상태
  const history = useHistory();

  // 사용자의 정보를 불러오는 함수
  const fetchUserProfile = async () => {
    try {
        const response = await axios.get('/api/users/auth');
        if (response.status === 200) {
        const userData = response.data;
        setUser({
          nickname: userData.name,
          gender: userData.gender || 'N/A',
          birthYear: userData.birthYear || 'N/A',
          genre: userData.genre || [],
          profilePhoto: userData.image || ''
        });
      }
    } catch (err) {
      console.error('프로필 가져오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 프로필 사진 변경 핸들러
  const handleProfilePicChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", files);  // 'file'은 서버 설정과 일치해야 합니다.

      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      try {
        const response = await axios.post('/api/users/upload-profile-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.status === 200) {
          setProfilePic(files);
          setUser((prevUser) => ({ ...prevUser, profilePhoto: response.data.profilePhotoUrl }));
        }
      } catch (err) {
        console.error('프로필 사진 업로드 실패:', err);
      }
    }
  };

  // 프로필 수정 핸들러
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // 장르 선택 핸들러
  const handleGenreChange = (e) => {
    const genreId = parseInt(e.target.value, 10);
    const selectedGenre = GenreOptions.find(option => option.value === genreId)?.label || '';

    if (user.genre.includes(selectedGenre)) {
      setUser((prevUser) => ({ ...prevUser, genre: prevUser.genre.filter(genre => genre !== selectedGenre) }));
    } else if (user.genre.length < 3) {
      setUser((prevUser) => ({ ...prevUser, genre: [...prevUser.genre, selectedGenre] }));
    } else {
      alert('최대 3개의 장르만 선택 가능합니다.');
    }
  };

  const handleProfileSave = async () => {
    try {
      const response = await axios.post('/api/users/update-profile', {
        nickname: user.nickname,
        gender: user.gender,
        birthYear: user.birthYear,
        genre: user.genre
      });

      if (response.status === 200 && response.data.success) {
        alert('프로필이 성공적으로 수정되었습니다.');
        history.push('/user');
      } else {
        alert('프로필 수정 실패');
      }
    } catch (err) {
      console.error('프로필 수정 실패:', err);
    }
  };
  
  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>프로필 수정</h1>
        <p>프로필 정보를 수정하고 저장하세요.</p>
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
            <div className="file-input-container">
              <input type="file" accept="image/*" onChange={handleProfilePicChange} />
            </div>
          </div>
          <div className="user-info">
            <label>
              <span>이름:</span>
              <input
                type="text"
                name="nickname"
                value={user.nickname}
                onChange={handleProfileChange}
              />
            </label>
            <label>
              <span>성별:</span>
              <select
                name="gender"
                value={user.gender}
                onChange={handleProfileChange}
              >
                {GenderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>태어난 해:</span>
              <select
                name="birthYear"
                value={user.birthYear}
                onChange={handleProfileChange}
              >
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={String(year)}>{year}</option>
                ))}
              </select>
            </label>
            <label>
              <span>장르:</span>
              <div className="genre-checkbox-group">
                {GenreOptions.map(option => (
                  <label key={option.value} className="genre-checkbox">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={user.genre.includes(option.label)}
                      onChange={handleGenreChange}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </label>

            <button onClick={handleProfileSave} className="save-button">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
