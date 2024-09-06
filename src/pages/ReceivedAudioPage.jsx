import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext'; // useAuth 훅을 통해 전역 상태 가져오기

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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

const AudioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const AudioMessage = styled.audio`
  width: 100%;
  max-width: 700px;
  height: 60px;
  margin-bottom: 2rem;
`;

const DownloadButton = styled.button`
  font-size: 1.25rem;
  padding: 1rem 2rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
`;

const ReceivedAudioPage = () => {
  const { memberId } = useAuth(); // 전역적으로 관리되는 memberId 가져오기
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState('아직 도착한 음성 파일이 없습니다!');
  const audioRef = useRef(null); // 오디오 태그 참조를 위한 useRef 생성

  useEffect(() => {
    if (!memberId) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    const eventSource = new EventSource(
      `http://13.125.130.243/api/subscribe/${memberId}`
    );

    eventSource.addEventListener('alarm', (event) => {
      console.log('Received event:', event.data); // 서버로부터 받은 데이터를 확인
      const data = JSON.parse(event.data); // JSON 형식인지 확인 후 파싱
      if (data.voiceRecordUrl) {
        setAudioUrl(data.voiceRecordUrl);
        setMessage('새로운 음성 파일이 도착했습니다!');
      } else {
        console.warn('voiceRecordUrl이 없습니다.', data); // 데이터 형식 문제 확인
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      setMessage('오류가 발생했습니다.');
      eventSource.close(); // SSE 연결 종료
    };

    return () => {
      eventSource.close(); // 컴포넌트 언마운트 시 SSE 연결 종료
    };
  }, [memberId]);

  // 새로운 음성 파일이 도착했을 때 자동으로 1회 재생
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('자동 재생 실패:', error);
      });
    }
  }, [audioUrl]);

  const handleDownload = () => {
    if (audioUrl) {
      // 다운로드를 위한 링크 생성
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'received-audio.mp3'; // 명시적으로 파일 이름 지정
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 링크 제거
    }
  };

  return (
    <Container>
      <AudioWrapper>
        <Title>{message}</Title>
        {audioUrl && (
          <>
            <AudioMessage
              controls
              src={`https://like-lion-dynamo.s3.amazonaws.com/${audioUrl}`}
              ref={audioRef}
            />
            <DownloadButton onClick={handleDownload}>다운로드</DownloadButton>
          </>
        )}
      </AudioWrapper>
    </Container>
  );
};

export default ReceivedAudioPage;
