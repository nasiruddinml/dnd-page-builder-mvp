import React, { useRef } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { COMPONENT } from "../../../constants";

const style = {
  border: "1px dashed black",
  padding: "0.5rem 1rem",
  backgroundColor: "white",
  cursor: "move",
};
const BaseComponent = ({ data, components, path, preview = false }: any) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: COMPONENT,
    item: { type: COMPONENT, id: data.id, path },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const component = components[data.id];

  return preview ? (
    <div 
      style={{ ...style, cursor: 'default' }}
      className="component"
    >
      <div>{component.content}</div>
    </div>
  ) : (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="component draggable"
    >
      <div>{data.id}</div>
      <div>{component.content}</div>
    </div>
  );
};
export default BaseComponent;
