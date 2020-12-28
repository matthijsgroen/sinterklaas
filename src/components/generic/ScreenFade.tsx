import styled from "styled-components";

export interface ScreenFadeProps {
  active: boolean | number;
  color: string;
}

const ScreenFade = styled.div.withConfig({
  shouldForwardProp: prop => !["color", "active"].includes(prop),
})<ScreenFadeProps>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: ${props => props.theme.windowWidth}px;
  height: ${props => props.theme.windowHeight}px;
  transition: opacity 0.5s ease-in-out, background-color 0.5s ease-in-out;
  pointer-events: none;
  background-color: ${props => props.color};
  opacity: ${props =>
    props.active === true
      ? "1.0"
      : props.active === false
      ? "0"
      : `${props.active}`};
`;

export default ScreenFade;
