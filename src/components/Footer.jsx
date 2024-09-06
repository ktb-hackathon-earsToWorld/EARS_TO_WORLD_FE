import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // AuthContext에서 useAuth 가져오기

const FooterContainer = styled.footer`
  width: 100%; /* 부모 컨테이너의 너비를 꽉 채움 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
  background-color: #0057b7;
  box-sizing: border-box;
`;

const FooterNavLink = styled(Link)`
  font-size: 1.2rem;
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FooterButton = styled.button`
  font-size: 1.2rem;
  padding: 0.625rem 1.25rem;
  background-color: #ff6464;
  border: none;
  color: white;
  border-radius: 0.3125rem;
  cursor: pointer;

  &:hover {
    background-color: #ff4c4c;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const Footer = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // useAuth로 로그인 상태 관리
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://13.125.130.243/api/logout',
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsLoggedIn(false); // 로그아웃 시 로그인 상태 업데이트
        navigate('/'); // 로그아웃 후 홈으로 리다이렉트
      } else {
        console.error('로그아웃 실패:', response.data);
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <FooterContainer>
      <FooterNavLink to='/'>파일 변환</FooterNavLink>
      <FooterNavLink to='/text-to-audio'>텍스트 변환</FooterNavLink>
      <FooterNavLink to='/received-audio'>받은 파일</FooterNavLink>
      <FooterButton onClick={handleLoginClick}>
        {isLoggedIn ? '로그아웃' : '로그인'}
      </FooterButton>
    </FooterContainer>
  );
};

export default Footer;
