import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState('아직 도착한 음성 파일이 없습니다!');

  useEffect(() => {
    // 5초 후에 예시 음성 파일 도착
    const timeoutId = setTimeout(() => {
      setAudioUrl(
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      ); // 예시 음성 파일 URL
      setMessage('새로운 음성 파일이 도착했습니다!');
    }, 5000); // 5초 후에 음성 파일이 도착한 것으로 설정

    return () => clearTimeout(timeoutId); // 컴포넌트 언마운트 시 타이머 제거
  }, []);

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
            <AudioMessage controls src={audioUrl} />
            <DownloadButton onClick={handleDownload}>다운로드</DownloadButton>
          </>
        )}
      </AudioWrapper>
    </Container>
  );
};

export default ReceivedAudioPage;
