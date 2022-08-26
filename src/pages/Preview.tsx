import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import initialPage from "../constants/mockData";
import Row from "../core/components/row/Row";

const Preview = () => {
  const initialLayout = initialPage.layout;
  const initialComponents = initialPage.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);

  useEffect(() => {
    // Load the layout on mount
    const savedLayout = localStorage.getItem("layout");
    if (savedLayout) {
        const newLayout = JSON.parse(savedLayout);
        setLayout(newLayout);
    }

    // Load the Components on mount
    const savedComponents = localStorage.getItem("components");
    if (savedComponents) {
      const newComponents = JSON.parse(savedComponents);
      setComponents(newComponents);
    }
    // Respond to the `storage` event
    function storageEventHandler(event: any) {
        if (event.key === "layout") {
            const newLayout = JSON.parse(event.newValue);
            setLayout(newLayout);
        }
    }
    // Hook up the event handler
    window.addEventListener("storage", storageEventHandler);
    return () => {
        // Remove the handler when the component unmounts
        window.removeEventListener("storage", storageEventHandler);
    };
  }, [])

  const renderRow = (row: any, currentPath: any) => {
    return (
      <Row
        key={row.id}
        data={row}
        components={components}
        path={currentPath}
        preview={true}
      />
    );
  };

  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="body">
      <div className="pageContainer">
        <div className="page">
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PreviewWrapper = () => (<DndProvider backend={HTML5Backend}>
  <Preview />
</DndProvider>);

export default PreviewWrapper;
