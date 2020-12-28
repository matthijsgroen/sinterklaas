import React from "react";
import styled from "styled-components";
import { rgba } from "src/lib/style/colors";

interface DialogBoxProps {
  title: string;
  onClose: () => void;
}

const Title = styled.h1`
  padding: 0.25rem 1rem;
  font-size: 1rem;
  flex: auto;
`;

const CloseButton = styled.button`
  border: none;
  border-left: 2px solid ${props => props.theme.colors.secondary};
  background-color: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.secondary};
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
`;

const Header = styled.header`
  border-bottom: 2px solid ${props => props.theme.colors.secondary};
  display: flex;
  flex-direction: row;
  color: ${props => props.theme.colors.secondary};
`;

const Box = styled.div`
  border: 2px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  background: ${props => rgba(props.theme.colors.main, 0.8)};
`;

const BoxContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const DialogBox: React.FC<DialogBoxProps> = ({ title, children, onClose }) => (
  <BoxContainer>
    <Box>
      <Header>
        <Title>{title}</Title>
        <CloseButton
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          &times;
        </CloseButton>
      </Header>
      <div>{children}</div>
    </Box>
  </BoxContainer>
);

export default DialogBox;
