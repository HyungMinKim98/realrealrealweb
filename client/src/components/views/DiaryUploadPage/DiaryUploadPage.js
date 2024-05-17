import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, DatePicker, Select, Icon, Card, Divider } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import StarRating from './StarRating'; // 별점 컴포넌트 경로 확인
import { GenreOptions, PrivacyOptions, CategoryOptions } from '../DiaryEditPage/Options';
const { TextArea } = Input;
const { Title } = Typography;



function DiaryUploadPage(props) {
    const user = useSelector(state => state.user);
    const [DiaryTitle, setDiaryTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Privacy, setPrivacy] = useState(0);
    const [Category, setCategory] = useState("Movie & TvShow");
    const [DiaryDate, setDiaryDate] = useState(null);
    const [Genre, setGenre] = useState("");
    const [Rating, setRating] = useState(0);
    const [FilePath, setFilePath] = useState("");
    const [Preview, setPreview] = useState("");  // 이미지 미리보기를 위한 상태

    const onTitleChange = (e) => {
        setDiaryTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivacyChange = (value) => {
        setPrivacy(value);
    }

    const onCategoryChange = (value) => {
        setCategory(value);
    }

    const onGenreChange = (value) => {
        setGenre(value);
    }
    const onDrop = (files) => {
        let formData = new FormData();
        const config = { header: { 'content-type': 'multipart/form-data' } };
        formData.append("file", files[0]);

        Axios.post('/api/diary/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setFilePath(response.data.url);

                    // 이미지 미리보기 설정
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreview(reader.result);
                    };
                    reader.readAsDataURL(files[0]);

                } else {
                    alert('Failed to upload file!');
                }
            });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!DiaryTitle || !Description || !Genre) {
            message.error('Please fill all the fields!');
            return;
        }

        const variables = {
            writer: user.userData._id,
            title: DiaryTitle,
            description: Description,
            privacy: Privacy,
            category: Category,
            genre: Genre,
            date: DiaryDate,
            rating: Rating,
            filePath: FilePath

        };

        Axios.post('/api/diary/uploadDiary', variables)
            .then(response => {
                if (response.data.success) {
                    message.success('성공적으로 업로드를 했습니다!')
                    setTimeout(() => {
                        props.history.push('/');
                    }, 3000);
                } else {
                    alert('다이어리 업로드에 실패했습니다!')
                }
            });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <Card style={{ borderRadius: 8 }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Title level={2}>Upload Diary</Title>
                </div>
                <Form onSubmit={onSubmit} layout="vertical">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
                            {({ getRootProps, getInputProps }) => (
                                <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Icon type="plus" style={{ fontSize: '3rem' }} />
                                </div>
                            )}
                        </Dropzone>
                        {/* {File && <p>Selected File: {File.url}</p>} */}
                        {Preview && (
                         <img src={Preview} alt="Preview" style={{ width: '300px', height: '240px', objectFit: 'cover' }} />
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
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </Select >
                    </Form.Item>
                    <Form.Item label="Category">
                        <Select value={Category} onChange={onCategoryChange} style={{ width: '100%' }}>
                            {CategoryOptions.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </Select >
                    </Form.Item>
                    <Form.Item label="Genre">
                        <Select value={Genre}  onChange={onGenreChange} style={{ width: '100%' }}>
                            {GenreOptions.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            ))}
                        </Select >
                    </Form.Item>
                    <Form.Item label="Date">
                        <DatePicker onChange={date => setDiaryDate(date)} value={DiaryDate} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Rating">
                        <StarRating rating={Rating} setRating={setRating} />
                    </Form.Item>
                    <Divider />
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" size="large" onClick={onSubmit}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default DiaryUploadPage;

