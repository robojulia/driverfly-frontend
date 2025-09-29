import React from 'react';
import styled from 'styled-components';

interface PromotionalCTAProps {
  title: string;
  buttonText: string;
  onClick: () => void;
  className?: string;
}

const CTAContainer = styled.div`
  background: linear-gradient(135deg, #4fd1c7 0%, #22c55e 100%);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  min-height: 120px;
  max-width: 280px;

  &::before {
    content: '';
    position: absolute;
    top: -30px;
    right: -30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: -20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }
`;

const CTATitle = styled.h4`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
  position: relative;
  z-index: 1;
  font-size: 1rem;
  line-height: 1.3;
`;

const CTAButton = styled.button`
  background-color: white;
  color: #1f2937;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  position: relative;
  z-index: 1;
  font-size: 0.875rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: #f9fafb;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 0.75rem;
`;

const PromotionalCTA: React.FC<PromotionalCTAProps> = ({
  title,
  buttonText,
  onClick,
  className,
}) => {
  return (
    <CTAContainer className={className}>
      <CTATitle>{title}</CTATitle>
      <ButtonWrapper>
        <CTAButton onClick={onClick}>{buttonText}</CTAButton>
      </ButtonWrapper>
    </CTAContainer>
  );
};

export default PromotionalCTA;
