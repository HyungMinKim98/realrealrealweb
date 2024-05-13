import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Divider, Button, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PrivacyOptions, CategoryOptions, GenreOptions } from '../DiaryEditPage/Options';

const { Title, Paragraph, Text } = Typography;

function DetailDiaryPage(props) {
  const diaryId = props.match.params.diaryId;
  const [DiaryDetail, setDiaryDetail] = useState(null);

  useEffect(() => {
    const diaryVariable = { diaryId };

    axios.post('/api/diary/getDiaryDetail', diaryVariable)
      .then(response => {
        if (response.data.success) {
          setDiaryDetail(response.data.diaryDetail);
        } else {
          alert('Failed to get Diary information');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error fetching Diary information');
      });
  }, [diaryId]);

  const getLabel = (options, value) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : 'Unknown';
  };

  if (DiaryDetail) {
    return (
      <div style={{ width: '85%', margin: '3rem auto' }}>
        <Card
          style={{ borderRadius: 8 }}
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={DiaryDetail.writer.image} size={64} />
              <div style={{ marginLeft: '1rem' }}>
                <Title level={3} style={{ marginBottom: 0 }}>{DiaryDetail.writer.name}</Title>
                <Paragraph type="secondary">{moment(DiaryDetail.createdAt).format('YYYY-MM-DD HH:mm')}</Paragraph>
              </div>
            </div>
          }
        >
          <Title level={2} style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem' }}>{DiaryDetail.title}</Title>
          <Divider />
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
            {DiaryDetail.description}
          </Paragraph>
          <Divider />
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>Privacy:</Text> {getLabel(PrivacyOptions, DiaryDetail.privacy)}
            </Col>
            <Col span={12}>
              <Text strong>Category:</Text> {getLabel(CategoryOptions, DiaryDetail.category)}
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>Genre:</Text> {getLabel(GenreOptions, DiaryDetail.genre)}
            </Col>
            <Col span={12}>
              <Text strong>Rating:</Text> {DiaryDetail.rating}
            </Col>
          </Row>
          <Divider />
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <Button type="primary" style={{ marginRight: '10px' }} href="/">목록으로 돌아가기</Button>
            <Button type="default" href={`/diary/edit/${DiaryDetail._id}`}>수정</Button>
          </div>
        </Card>
      </div>
    );
  } else {
    return (
      <div style={{ width: '85%', margin: '3rem auto', textAlign: 'center' }}>
        <Paragraph>Loading...</Paragraph>
      </div>
    );
  }
}

export default DetailDiaryPage;
