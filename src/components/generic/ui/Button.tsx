import styled from "styled-components";

export const Button = styled.button`
  background: red;
  color: yellow;

  cursor: pointer;
  font-size: 1rem;

  padding: 0.75rem 1rem;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 0, 0.3);
  }
`;
