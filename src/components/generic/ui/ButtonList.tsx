import React, { ReactNode } from "react";
import styled from "styled-components";

const List = styled.ul`
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  list-style: none;
  margin: 1rem;
`;

export const ButtonList: React.FC = ({ children }) =>
  !children ? null : (
    <List>
      {([] as ReactNode[]).concat(children).map((child, index) => (
        <ListItem key={index}>{child}</ListItem>
      ))}
    </List>
  );
