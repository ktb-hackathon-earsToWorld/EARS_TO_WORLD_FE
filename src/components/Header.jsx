import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  width: 100%; /* 부모 컨테이너의 너비를 꽉 채움 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #0057b7;
  box-sizing: border-box;
  height: 60px; /* 고정된 높이 */
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  margin: 0;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>귀로보는세상</Logo>
    </HeaderContainer>
  );
};

export default Header;
