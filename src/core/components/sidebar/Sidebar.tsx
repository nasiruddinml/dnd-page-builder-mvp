import React from "react";
import { useDrag } from "react-dnd";

const SideBar = ({ data }: any) => {
  const [{ opacity }, drag] = useDrag({
    type: data.type,
    item: data,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });
  
  return (
    <div className="sideBarItem" ref={drag} style={{ opacity }}>
      {data.component.type}
    </div>
  );
};
export default SideBar;
