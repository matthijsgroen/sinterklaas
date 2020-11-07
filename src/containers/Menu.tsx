import React from "react";
import { connect } from "react-redux";
import menu from "src/state/menu";
import Menu, { MenuProps } from "src/components/Menu";
import { RootState } from "src/state/store";

export interface ConnectedSceneProps {
  visible: boolean;
  options: MenuProps["options"];
  choose: MenuProps["onClick"];
}

const ConnectedScene: React.FC<ConnectedSceneProps> = ({
  visible,
  options,
  choose,
}) => (visible ? <Menu options={options} onClick={choose} /> : null);

const mapStateToProps = (state: RootState) => state.menu;
const mapDispatchToProps = {
  choose: menu.actions.choose,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScene);
