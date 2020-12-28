import styled, { css } from "styled-components";

interface BackgroundBlurProps {
  active: boolean;
}

const BackgroundBlur = styled.div<BackgroundBlurProps>`
  transition: backdrop-filter 200ms;
  width: ${props => props.theme.windowWidth}px;
  height: ${props => props.theme.windowHeight}px;
  position: absolute;
  pointer-events: ${props => (props.active ? "unset" : "none")};

  ${props =>
    props.active &&
    css`
      backdrop-filter: blur(4px);
    `}
`;

export default BackgroundBlur;
