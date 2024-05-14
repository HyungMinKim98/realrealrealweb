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
      <List.Item className="detail-list-item">
        <strong className="detail-info-title">{title}:</strong> <span className="detail-info-value">{value || 'N/A'}</span>
      </List.Item>
    );
  };

  return (
    <div className="detail-page">
      {details && (
        <div className="detail-content">
          <div className="detail-poster-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title || details.name}
              className="detail-poster"
            />
          </div>
          <div className="detail-info">
            <Title level={2} className="detail-title">{details.title || details.name}</Title>
            <Paragraph className="detail-overview">{details.overview}</Paragraph>
            <Button
              href={`https://www.themoviedb.org/${type}/${id}`}
              target="_blank"
              className="tmdb-button"
            >
              Visit TMDB Page
            </Button>

            <Divider />

            <List className="detail-list">
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
        </div>
      )}
    </div>
  );
};

export default DetailPage;