import { rgba } from "src/lib/style/colors";
import styled from "styled-components";

export const Button = styled.button`
  background: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;
  font-size: 1rem;

  padding: 0.75rem 1rem;
  width: 100%;

  &:hover {
    background-color: ${props => rgba(props.theme.colors.secondary, 0.3)};
  }
`;
