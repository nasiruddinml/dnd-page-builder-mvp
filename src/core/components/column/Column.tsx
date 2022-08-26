import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { COLUMN } from "../../../constants";
import DropZone from "../../dropzone/DropZone";
import BaseComponent from "../base-component/BaseComponent";

const style = {};

const Column = ({ data, components, handleDrop, path, preview = false }: any) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: COLUMN,
    item: {
      type: COLUMN,
      id: data.id,
      children: data.children,
      path
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component: any, currentPath: string) => {
    return (
      <BaseComponent
        key={component.id}
        data={component}
        components={components}
        path={currentPath}
        preview={preview}
      />
    );
  };

  return preview ?
  (
    <div
      style={{ ...style }}
      className="column"
    >
      {data.children.map((component: any, index: number) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      })}
    </div>
  ) : (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable column"
    >
      {data.id}
      {data.children.map((component: any, index: number) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={component.id}>
            <DropZone
              data={{
                path: currentPath,
                childrenCount: data.children.length
              }}
              onDrop={handleDrop}
            />
            {renderComponent(component, currentPath)}
          </React.Fragment>
        );
      })}
      <DropZone
        data={{
          path: `${path}-${data.children.length}`,
          childrenCount: data.children.length
        }}
        onDrop={handleDrop}
        isLast
      />
    </div>
  );
};
export default Column;
