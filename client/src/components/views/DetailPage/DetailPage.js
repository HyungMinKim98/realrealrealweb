// src/pages/DetailPage/DetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, List, Divider } from 'antd';
import './DetailPage.css';

const { Title, Paragraph } = Typography;

const DetailPage = () => {
  const { id, type } = useParams();
  const [details, setDetails] = useState({});
  const apiKey = '50aaab29ad70cc1875e49e7512650e80';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=ko-KO`;
        const response = await axios.get(url);

        if (response.status === 200) {
          setDetails(response.data);
        } else {
          console.error('Failed to fetch details');
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, [id, type]);

  const renderDetailInfo = (title, value) => {
    return (
      <List.Item>
        <strong>{title}:</strong> {value || 'N/A'}
      </List.Item>
    );
  };

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      {details && (
        <div>
          <Title level={2}>{details.title || details.name}</Title>
          <img
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
            alt={details.title || details.name}
            style={{ width: '300px' }}
          />
          <Paragraph style={{ marginTop: '1rem' }}>{details.overview}</Paragraph>
          <Button
            href={`https://www.themoviedb.org/${type}/${id}`}
            target="_blank"
          >
            Visit TMDB Page
          </Button>

          <Divider />

          <List>
            {renderDetailInfo('Original Title', details.original_title || details.original_name)}
            {renderDetailInfo('Release Date', details.release_date || details.first_air_date)}
            {renderDetailInfo('Genres', details.genres?.map((genre) => genre.name).join(', ') || 'N/A')}
            {renderDetailInfo('Original Language', details.original_language)}
            {renderDetailInfo('Popularity', details.popularity)}
            {renderDetailInfo('Vote Average', details.vote_average)}
            {renderDetailInfo('Vote Count', details.vote_count)}
            {renderDetailInfo('Runtime', `${details.runtime || details.episode_run_time?.[0] || 'N/A'} minutes`)}
            {renderDetailInfo('Status', details.status)}
            {renderDetailInfo('Tagline', details.tagline)}
          </List>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
