import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ROW } from "../../../constants";
import DropZone from "../../dropzone/DropZone";
import Column from "../column/Column";

const style = {};
const Row = ({ data, components, handleDrop, path, preview = false }: any) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ROW,
    item: {
      type: ROW,
      id: data.id,
      children: data.children,
      path
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderColumn = (column: any, currentPath: string) => {
    return (
      <Column
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
        preview={preview}
      />
    );
  };

  return preview ? (
    <div ref={ref} style={{ ...style }} className="row">
      <div className="columns">
        {data.children.map((column: any, index: number) => {
          const currentPath = `${path}-${index}`;
          return (
            <React.Fragment key={column.id}>
              {renderColumn(column, currentPath)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  ) 
  :(
    <div ref={ref} style={{ ...style, opacity }} className="base draggable row">
      {data.id}
      <div className="columns">
        {data.children.map((column: any, index: number) => {
          const currentPath = `${path}-${index}`;

          return (
            <React.Fragment key={column.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                }}
                onDrop={handleDrop}
                className="horizontalDrag"
              />
              {renderColumn(column, currentPath)}
            </React.Fragment>
          );
        })}
        <DropZone
          data={{
            path: `${path}-${data.children.length}`,
            childrenCount: data.children.length
          }}
          onDrop={handleDrop}
          className="horizontalDrag"
          isLast
        />
      </div>
    </div>
  );
};
export default Row;
