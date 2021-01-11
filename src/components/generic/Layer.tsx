import styled, { css } from "styled-components";

interface LayerProps {
  z?: number;
}

const Layer = styled.div<LayerProps>`
  position: absolute;
  width: ${props => props.theme.windowWidth}px;
  height: ${props => props.theme.windowHeight}px;
  pointer-events: none;
  ${props =>
    props.z !== undefined &&
    css`
      z-index: ${props.z};
    `}
`;

export default Layer;
