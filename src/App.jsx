import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TextToAudioPage from './pages/TextToAudioPage';
import ReceivedAudioPage from './pages/ReceivedAudioPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  max-height: calc(100vw * (740 / 360));
  min-height: 740px;
  width: calc(100vh * (360 / 740));
  max-width: 100vw;
  min-width: 360px;
  margin-left: auto;
  margin-right: auto;
  background-color: #f5f5f5;
  box-sizing: border-box;
`;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); // 현재 페이지 위치를 확인하는 훅

  // 페이지가 변경될 때마다 세션 체크
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/check-session', {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('세션 확인 오류:', error);
        setIsLoggedIn(false);
      }
    };

    checkSession(); // 페이지 변경 시마다 세션 체크
  }, [location]); // location이 변경될 때마다 useEffect가 실행됨

  return (
    <Container>
      <Header isLoggedIn={isLoggedIn} /> {/* 헤더는 공통 레이아웃을 꽉 채움 */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/text-to-audio' element={<TextToAudioPage />} />
        <Route path='/received-audio' element={<ReceivedAudioPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
      <Footer /> {/* 푸터도 공통 레이아웃을 꽉 채움 */}
    </Container>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
