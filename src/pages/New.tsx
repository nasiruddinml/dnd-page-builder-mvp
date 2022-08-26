import React, { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
  saveToStorage
} from "../utils/helpers";

import { SIDEBAR_ITEMS, SIDEBAR_ITEM, COMPONENT, COLUMN } from "../constants";
import SideBar from "../core/components/sidebar/Sidebar";
import DropZone from "../core/dropzone/DropZone";
import DeleteDropZone from "../core/dropzone/DeleteDropZone";
import initialPage from "../constants/mockData";
import Row from "../core/components/row/Row";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const New = () => {
  const initialLayout = initialPage.layout;
  const initialComponents = initialPage.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone: any, item: any) => {
      const splitItemPath = item.path.split("-");
      saveToStorage('layout', handleRemoveItemFromLayout(layout, splitItemPath));
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  useEffect(() => {
    // Save the layout on mount
    saveToStorage('layout', JSON.stringify(layout));

    // Save the Components on mount
    saveToStorage('components', JSON.stringify(components));
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

  const handleDrop = useCallback(
    (dropZone: any, item: any) => {
      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem: any = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: nanoid(),
          ...item.component
        };
        const newItem = {
          id: newComponent.id,
          type: COMPONENT
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent
        });
        saveToStorage('components', {
          ...components,
          [newComponent.id]: newComponent
        })
        saveToStorage('layout', 
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        )
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          saveToStorage('layout', 
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );

          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children

        saveToStorage('layout',
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );

        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // 3. Move + Create
      saveToStorage('layout', 
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      )
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components]
  );

  const renderRow = (row: any, currentPath: any) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
      />
    );
  };

  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="body">
      <div className="sideBar">
        {Object.values(SIDEBAR_ITEMS).map((sideBar, index) => (
          <SideBar key={sideBar.id} data={sideBar} />
        ))}
      </div>
      <div className="pageContainer">
        <div className="page">
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length
                  }}
                  onDrop={handleDrop}
                  path={currentPath}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>

        <DeleteDropZone
          data={{
            layout
          }}
          onDrop={handleDropToTrashBin}
        />
      </div>
    </div>
  );
};

const NewWrapper = () => (<DndProvider backend={HTML5Backend}>
  <New />
</DndProvider>);

export default NewWrapper;
