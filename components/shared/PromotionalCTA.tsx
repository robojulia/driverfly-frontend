import React from "react";
import styled from "styled-components";

interface PromotionalCTAProps {
  title: string;
  buttonText: string;
  onClick: () => void;
  className?: string;
}

const CTAContainer = styled.div`
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--primary-dark) 100%
  );
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  color: var(--text-light);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--box-shadow);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30px;
    left: -30px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }
`;

const CTATitle = styled.h4`
  font-weight: bold;
  margin-bottom: var(--spacing-md);
  color: var(--text-light);
  position: relative;
  z-index: 1;
`;

const CTAButton = styled.button`
  background-color: var(--success);
  color: var(--primary-dark);
  border: none;
  border-radius: calc(var(--border-radius) / 2);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: bold;
  cursor: pointer;
  transition: transform var(--transition-speed),
    box-shadow var(--transition-speed);
  width: 100%;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonWrapper = styled.div`
  margin-top: var(--spacing-md);
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
