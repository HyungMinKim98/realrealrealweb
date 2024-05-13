import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, DatePicker, Select, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import StarRating from './StarRating';  // 별점 컴포넌트 경로 확인
import { GenreOptions, PrivacyOptions, CategoryOptions } from '../DiaryEditPage/Options';

const { TextArea } = Input;
const { Title } = Typography;

function DiaryUploadPage(props) {
    const user = useSelector(state => state.user);
    const [DiaryTitle, setDiaryTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Privacy, setPrivacy] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [DiaryDate, setDiaryDate] = useState(null);
    const [Genre, setGenre] = useState("");
    const [Rating, setRating] = useState(0);
    const [File, setFile] = useState(null);
    const [Preview, setPreview] = useState("");  // 이미지 미리보기를 위한 상태
    const handlePrivacyChange = value => {
        setPrivacy(parseInt(value, 10));
    };
    
    const handleCategoryChange = value => {
        setCategory(parseInt(value, 10));
    };
    
    const handleGenreChange = value => {
        setGenre(parseInt(value, 10));
    };
    
    const handleRatingChange = value => {
        setRating(parseInt(value, 10));
    };
    const onDrop = (files) => {
        if (files.length > 0) {
            const file = files[0];
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
    
        if (!DiaryTitle || !Description || !Genre || !DiaryDate || !File) {
            message.error('모든 필드를 입력해주세요!');
            return;
        }
    
        let formData = new FormData();
        formData.append('file', File);
        formData.append('title', DiaryTitle);
        formData.append('description', Description);
        // 숫자로 명시적 변환
        formData.append('privacy', Number(Privacy));
        formData.append('category', Number(Category));
        formData.append('genre', Number(Genre));
        formData.append('rating', Number(Rating));
        formData.append('date', DiaryDate ? DiaryDate.format('YYYY-MM-DD') : '');
    
        Axios.post('/api/diary/uploadDiary', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.data.success) {
                message.success('성공적으로 업로드를 했습니다!');
                setTimeout(() => {
                    props.history.push('/');
                }, 3000);
            } else {
                message.error('다이어리 업로드에 실패했습니다: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error("Upload error", error.response);
            alert('다이어리 업로드에 실패했습니다: ' + (error.response.data.error || error.response.statusText));
        });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Diary</Title>
            </div>

              <Form onSubmit={onSubmit}>
                <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
                        </div>
                    )}
                </Dropzone>
                {File && <p>Selected File: {File.name}</p>}
                {Preview && (
                    <img src={Preview} alt="Preview" style={{ width: '300px', height: '240px', objectFit: 'cover' }} />
                )}
                <Form.Item label="Title">
                    <Input onChange={e => setDiaryTitle(e.target.value)} value={DiaryTitle} />
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea onChange={e => setDescription(e.target.value)} value={Description} />
                </Form.Item>
                <Form.Item label="Privacy">
                    <Select onChange={handlePrivacyChange} value={Privacy.toString()}>
                        {PrivacyOptions.map(option => (
                            <Select.Option key={option.value} value={option.value.toString()}>{option.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Category">
                    <Select onChange={handleCategoryChange} value={Category.toString()}>
                        {CategoryOptions.map(option => (
                            <Select.Option key={option.value} value={option.value.toString()}>{option.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Genre">
                    <Select onChange={handleGenreChange} value={Genre.toString()}>
                        {GenreOptions.map(option => (
                            <Select.Option key={option.value} value={option.value.toString()}>{option.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Date">
                    <DatePicker onChange={date => setDiaryDate(date)} value={DiaryDate} />
                </Form.Item>
                <Form.Item label="Rating">
    <Select onChange={handleRatingChange} value={Rating.toString()}>
        {GenreOptions.map(option => (
            <Select.Option key={option.value} value={option.value.toString()}>{option.label}</Select.Option>
        ))}
    </Select>
</Form.Item>
                <Button type="primary" size="large" onClick={onSubmit}>Submit</Button>
            </Form>
        </div>
    );
}

export default DiaryUploadPage;
