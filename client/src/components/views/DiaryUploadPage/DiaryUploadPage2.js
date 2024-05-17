
import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, DatePicker, Select, Icon } from 'antd';
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
    const [Category, setCategory] = useState("Film & Animation");
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

    const onPrivacyChage = (e) => {
        setPrivacy(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onGenreChange = (e) => {
        setGenre(e.currentTarget.value)
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
            // filePath: FilePath

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
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Diary</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={1000000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>
                </div>
                {File && <p>Selected File: {File.url}</p>}
                        {Preview && (
                         <img src={Preview} alt="Preview" style={{ width: '300px', height: '240px', objectFit: 'cover' }} />
                        )}

                <br />
                <br />
                <label>Title</label>
                <Input onChange={onTitleChange} value={DiaryTitle} />
                <br />
                <br />
                <label>Description</label>
                <TextArea onChange={onDescriptionChange} value={Description} />
                <br />
                <br />
             

                <label>Privacy</label>
        <br />

        <select onChange={onPrivacyChage}>
                    {PrivacyOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
        </select>

                <br />
                <br />
                <label>Category</label>  
        <br />              
        <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (                       
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}

        </select>

                <br />
                <br />
                <label>Genre</label>     
        <br />          
        <select onChange={onGenreChange}>
                    {GenreOptions.map((item, index) => (                       
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}

        </select>

                <br />
                <br />
                <label>Date</label>
                <DatePicker onChange={setDiaryDate} value={DiaryDate} />

                <br />
                <br />
                <label>Rating</label>
                <StarRating rating={Rating} setRating={setRating} />

                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default DiaryUploadPage;

// 이건 되는거임
