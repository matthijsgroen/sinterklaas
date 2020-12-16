import React, { ReactNode } from "react";
import styled from "styled-components";

const List = styled.ul`
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  list-style: none;
`;

export const OptionList: React.FC = ({ children }) =>
  !children ? null : (
    <List>
      {([] as ReactNode[]).concat(children).map((child, index) => (
        <ListItem key={index}>{child}</ListItem>
      ))}
    </List>
  );

export const Option = styled.button`
  background: none;
  border: none;
  color: yellow;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 0, 0.3);
  }
`;
