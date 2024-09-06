// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// AuthContext 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [memberId, setMemberId] = useState(null); // 로그인된 사용자의 memberId 저장

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, memberId, setMemberId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅을 사용하여 AuthContext 접근
export const useAuth = () => useContext(AuthContext);
