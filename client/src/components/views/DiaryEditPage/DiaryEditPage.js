import React, { useEffect, useState } from 'react';
import { Typography, Button, Form, message, Input, Icon, Card, Divider, Select } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import StarRating from '../DiaryUploadPage/StarRating';
import { PrivacyOptions, CategoryOptions, GenreOptions } from './Options';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

function DiaryEditPage(props) {
  const user = useSelector(state => state.user);
  const diaryId = props.match.params.diaryId;
  const [DiaryTitle, setDiaryTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Privacy, setPrivacy] = useState(0);
  const [Category, setCategory] = useState(0);
  const [Genre, setGenre] = useState(0);
  const [Rating, setRating] = useState(0);
  const [FilePath, setFilePath] = useState("");
  const [Preview, setPreview] = useState("");  // 이미지 미리보기를 위한 상태

  useEffect(() => {
    Axios.post('/api/diary/getDiaryDetail', { diaryId })
      .then(response => {
        if (response.data.success) {
          const { title, description, privacy, category, genre, rating, filePath } = response.data.diaryDetail;
          setDiaryTitle(title);
          setDescription(description);
          setPrivacy(privacy);
          setCategory(category);
          setGenre(genre);
          setRating(rating);
          setFilePath(filePath);
          setPreview(`/${filePath}`);

        } else {
          alert('Failed to fetch diary details');
        }
      });
  }, [diaryId]);

  const onTitleChange = (e) => {
    setDiaryTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivacyChange = (value) => {
    setPrivacy(value);
  };

  const onCategoryChange = (value) => {
    setCategory(value);
  };

  const onGenreChange = (value) => {
    setGenre(value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    formData.append("file", files[0]); // 'profilePhoto' 필드 사용
  
    Axios.post('/api/diary/uploadfiles', formData, config)
      .then(response => {
        if (response.data.success) {
          setFilePath(response.data.url); // 서버로부터 받은 URL을 상태에 저장
          setPreview(`/${response.data.url}`);
            // 이미지 미리보기 설정
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(files[0]);

        } else {
          alert('Failed to upload file');
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      });
  };


  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      diaryId,
      writer: user.userData._id,
      title: DiaryTitle,
      description: Description,
      privacy: Privacy,
      category: Category,
      genre: Genre,
      rating: Rating,
      filePath: FilePath
    };

    Axios.post('/api/diary/updateDiary', variables)
      .then(response => {
        if (response.data.success) {
          message.success('Successfully updated the diary!');
          setTimeout(() => {
            props.history.push(`/diary/${diaryId}`);
          }, 3000);
        } else {
          alert('Failed to update the diary');
        }
      });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <Card style={{ borderRadius: 8 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Title level={2}>다이어리 수정</Title>
        </div>
        <Form onSubmit={onSubmit} layout="vertical">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone
              onDrop={onDrop}
              multiple={false}
              maxSize={1000000000}
            >
              {({ getRootProps, getInputProps }) => (
                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Icon type="plus" style={{ fontSize: '3rem' }} />
                </div>
              )}
            </Dropzone>
            {FilePath && (
              <div style={{ marginLeft: '2rem' }}>
                <img
                  src={Preview}
                  alt="Preview"
                  style={{ width: '300px', height: '240px', objectFit: 'cover', borderRadius: 8 }}
                />
              </div>
            )}
          </div>
          <Divider />
          <Form.Item label="Title">
            <Input onChange={onTitleChange} value={DiaryTitle} />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea onChange={onDescriptionChange} value={Description} rows={4} />
          </Form.Item>
          <Form.Item label="Privacy">
            <Select value={Privacy} onChange={onPrivacyChange} style={{ width: '100%' }}>
              {PrivacyOptions.map((item, index) => (
                <Option key={index} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Category">
            <Select value={Category} onChange={onCategoryChange} style={{ width: '100%' }}>
              {CategoryOptions.map((item, index) => (
                <Option key={index} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Genre">
            <Select value={Genre} onChange={onGenreChange} style={{ width: '100%' }}>
              {GenreOptions.map((item, index) => (
                <Option key={index} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Rating">
            <StarRating rating={Rating} setRating={setRating} />
          </Form.Item>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" size="large" htmlType="submit">Submit</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default DiaryEditPage;