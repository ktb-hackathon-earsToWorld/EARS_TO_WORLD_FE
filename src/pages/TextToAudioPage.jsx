import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { PacmanLoader } from 'react-spinners'; // PacmanLoader 사용

// 모달 스타일 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 300px;

  &:focus {
    outline: none;
    border-color: #0057b7;
  }
`;

const ModalButton = styled.button`
  padding: 0.75rem;
  font-size: 1.125rem;
  background-color: #0057b7;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 100%;
  max-width: 150px;

  &:hover {
    background-color: #004494;
  }

  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

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

const Title = styled.h2`
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  max-width: 800px;
  min-height: 150px;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  box-sizing: border-box;
  resize: vertical;
  margin-bottom: 6rem;

  &:focus {
    outline: none;
    border-color: #0057b7;
  }
`;

const ConvertButton = styled.button`
  font-size: 1.25rem;
  padding: 1rem 2rem;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#0057b7')};
  color: white;
  border: none;
  border-radius: 0.625rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#003e9e')};
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5rem 0;
  width: 100%;
`;

const AudioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  height: 60px;
  margin-top: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SendButton = styled.button`
  font-size: 1.25rem;
  padding: 1rem 2rem;
  background-color: #0057b7;
  color: white;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;

  &:hover {
    background-color: #004494;
  }
`;

const ResetButton = styled.button`
  font-size: 1.25rem;
  padding: 1rem 2rem;
  background-color: #ff6464;
  color: white;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const TextToAudio = () => {
  const [text, setText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null); // 변환된 파일 URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState('');

  // 변환 로직
  const handleConvert = async () => {
    if (text.trim()) {
      setIsConverting(true);
      try {
        const response = await axios.post(
          'http://13.125.130.243/api/ear-to-world/text',
          {
            text: text,
          }
        );
        setConvertedFile(response.data.audioUrl); // 서버에서 반환된 오디오 파일 URL
        setIsConverted(true);
      } catch (error) {
        console.error('오디오 변환 실패:', error);
      } finally {
        setIsConverting(false);
      }
    }
  };

  // 파일 전송 로직
  const handleConfirmSend = async () => {
    if (userId.trim()) {
      try {
        const response = await axios.post(
          'http://13.125.130.243/api/audio?receiveLoginId=${userId}',
          {
            voidRecordUrl: convertedFile, // 변환된 파일 URL
          }
        );

        if (response.status === 200) {
          alert(`${userId}에게 파일을 전달했습니다!`);
        } else {
          alert('파일 전송에 실패했습니다.');
        }
      } catch (error) {
        console.error('파일 전송 실패:', error);
        alert('파일 전송 중 오류가 발생했습니다.');
      } finally {
        setIsModalOpen(false);
      }
    } else {
      alert('사용자 아이디를 입력해주세요.');
    }
  };

  const handleReset = () => {
    setText('');
    setIsConverted(false);
    setConvertedFile(null); // 초기화
    setUserId(''); // 아이디 리셋
  };

  return (
    <Container>
      {!isConverting && !isConverted && (
        <>
          <Title>텍스트를 입력하면 이해하기 쉽게 요약해 드립니다!</Title>
          <TextArea
            placeholder='여기에 텍스트를 입력하세요...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows='7'
          />
          <ConvertButton disabled={!text.trim()} onClick={handleConvert}>
            요약하여 음성파일로 변환하기
          </ConvertButton>
        </>
      )}

      {isConverting && (
        <LoaderContainer>
          <PacmanLoader size={50} color='#0057b7' />
        </LoaderContainer>
      )}

      {isConverted && (
        <ResultContainer>
          <AudioWrapper>
            <Title>변환이 완료되었습니다!</Title>
            <AudioPlayer controls src={convertedFile} />
          </AudioWrapper>
          <ButtonGroup>
            <SendButton onClick={() => setIsModalOpen(true)}>
              전달하기
            </SendButton>
            <ResetButton onClick={handleReset}>다시 시작하기</ResetButton>
          </ButtonGroup>
        </ResultContainer>
      )}

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>전달할 사용자의 아이디를 입력해주세요</h3>
            <Input
              type='text'
              placeholder='사용자 아이디'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <ButtonGroup>
              <ModalButton onClick={handleConfirmSend}>전달</ModalButton>
              <ModalButton onClick={() => setIsModalOpen(false)}>
                취소
              </ModalButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default TextToAudio;
