import React from "react";
import Layer from "./Layer";
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";

export interface ScreenScaleProps {
  className?: string;
}

interface ResizeProps {
  $scale: number;
}

const ResizeContainer = styled(Layer)<ResizeProps>`
  transform: scale(${props => props.$scale});
`;

const ClipContainer = styled.div`
  width: ${props => props.theme.windowWidth}px;
  height: ${props => props.theme.windowHeight}px;
  position: relative;
  overflow: hidden;
`;

const ScreenScale: React.FC<ScreenScaleProps> = ({ children, className }) => {
  const windowSize = useWindowSize();
  const scale =
    windowSize.height &&
    windowSize.width &&
    Math.min(windowSize.height / 720, windowSize.width / 1280);

  return (
    <ResizeContainer $scale={scale || 1.0}>
      <ClipContainer className={className}>{children}</ClipContainer>
    </ResizeContainer>
  );
};

export default ScreenScale;
