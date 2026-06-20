import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Page2 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <div className='TextContainer'>Page 2</div>
      <GoBackBtn onClick={handleGoBack}>
        Go Back
      </GoBackBtn>
    </PageContainer>
  );
};

const PageContainer = styled.section`
  background-color: #f7d794; 
  color: #596275;
  margin: 200px auto;
  width: 500px;
  height: 300px;
  border-radius: 50px 0px 50px 0px;
  border: 10px solid white;
  display: flex;
  flex-direction: column;
  align-items: center;

  .TextContainer {
    margin-top: 70px;
    font-size: 3rem;
    font-weight: bold;
    font-family: 'Baloo', sans-serif;
  }
`;

const GoBackBtn = styled.button`
  background-color: #e67e22; 
  color: white;
  border: none;
  border-radius: 8px;
  outline: none;
  width: 100px;
  height: 35px;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d35400;
    color: #ffffff;
    transform: translateY(-5px);
  }
`;

export default Page2;