// src/pages/LandingPage/LandingPage.js

import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography,Button, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Slider from 'react-slick';
import './LandingPage';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Diary, setDiarys] = useState([]);
  const [movies, setMovies] = useState([]); // 초기값을 빈 배열로 명확히 설정
  const [tvShows, setTvShows] = useState([]); // 초기값을 빈 배열로 명확히 설정
  const [currentPageDiary, setCurrentPageDiary] = useState(1);
  const itemsPerPage = 6;
  const apiKey = '50aaab29ad70cc1875e49e7512650e80'; // .env 대신 API 키를 직접 입력

  useEffect(() => {
    axios
      .get('/api/diary/getDiarys')
      .then((response) => {
        if (response.data.success) {
          setDiarys(response.data.diarys);
        } else {
          alert('Failed to get Diarys');
        }
      });

    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KO&page=1`
        );
        const data = await response.json();
        if (response.ok) {
          // Check if response is ok
          setMovies(data.results);
        } else {
          console.error('Failed to fetch movies:', data);
          alert('Failed to fetch movies: ' + data.status_message);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        alert('Error fetching movies: ' + error.message);
      }
    };

    const fetchTvShows = async () => {
      try {
        const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=ko-KO&page=1`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
          setTvShows(data.results);
        } else {
          console.error('Failed to fetch TvShows:', data);
        }
      } catch (error) {
        console.error('Error fetching TvShows:', error);
      }
    };
    fetchMovies();
    fetchTvShows();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderItems = (items, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

const renderDiaryCards = renderItems(Diary, currentPageDiary).map((diary) => (
    <Col key={diary._id} span={4}>
      <Card
        hoverable
        style={{ width: 180, marginBottom: 16 }}
        cover={<img alt="diary" src={diary.image} />}
      >
        <Meta
          avatar={<Avatar src={diary.writer.image} />}
          title={<a href={`/diary/${diary._id}`}>{diary.title}</a>}
          description={`${diary.writer.name} - ${moment(diary.createdAt).format('MMM Do YY')}`}
        />
      </Card>
    </Col>
  ));

  const renderMovieCards = movies.map((movie) => (
    <Card
      key={movie.id}
      hoverable
      className="card-container"
      cover={
        <a href={`/detail/movie/${movie.id}`}>
          <img
            alt={movie.title}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          />
        </a>
      }
    >
      <Meta title={movie.title} />
    </Card>
  ));

  const renderTvShowsCards = tvShows.map((tvShow) => (
    <Card
      key={tvShow.id}
      hoverable
      className="card-container"
      cover={
        <a href={`/detail/tv/${tvShow.id}`}>
          <img
            alt={tvShow.name}
            src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
          />
        </a>
      }
    >
      <Meta title={tvShow.name} />
    </Card>
  ));

  const renderPageNumbers = (totalItems, currentPage, setCurrentPage) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(
        <Button
          key={i}
          type={i === currentPage ? 'primary' : 'default'}
          onClick={() => setCurrentPage(i)}
          style={{ margin: '0 5px' }}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}>Recommended Diaries</Title>

      <Slider {...sliderSettings}>{renderDiaryCards}</Slider>
      <Row gutter={[16, 16]}>{renderDiaryCards}</Row>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {renderPageNumbers(Diary.length, currentPageDiary, setCurrentPageDiary)}
      </div>
      <Title level={2} style={{ marginTop: '2rem' }}>
        Featured Movies
      </Title>
      <Slider {...sliderSettings}>{renderMovieCards}</Slider>
      <Title level={2} style={{ marginTop: '2rem' }}>
        Featured TV Shows
      </Title>
      <Slider {...sliderSettings}>{renderTvShowsCards}</Slider>
    </div>
  );
}

export default LandingPage;