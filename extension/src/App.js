/*global chrome*/

import React, { useEffect, useState, useMemo } from "react";
import Board from "./components/Board";
import Modal from "./components/utility-components/Modal";
import Navbar from "./components/Navbar";
import {
  addNewBookmarkNode,
  getBookmarkNodes,
  moveItemsIntoContainer,
  updateBookmarkNodes,
  getAvailableIndices,
  getNewId,
  convertFolderToGroup,
} from "./utils/functions";
import {
  ITEMS_PER_PAGE,
  BookmarkNode,
  ROOT_ID,
  TEST_GROUP,
  TEST_BOOKMARK,
  ItemTypes,
  FORMS,
} from "./utils/types";
import PageBorder from "./components/PageBorder";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useItemsByPage } from "./utils/hooks";

const App = () => {
  const [page, setPage] = useState(0);
  const [topLevelItems, setTopLevelItems] = useState(null);
  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    console.log("Doing initial check for bookmark data");
    chrome.storage.local.get(["newBookmarkNodes"]).then((res) => {
      setNewItems(res.newBookmarkNodes);
    });

    // Get ALL top level bookmark nodes (folders, groups, bookmarks)
    getBookmarkNodes((node) => node.parentId == ROOT_ID).then((topLevelNodes) => {
      setTopLevelItems(topLevelNodes);
    });

    // Add chrome storage changed
    const listener = chrome.storage.onChanged.addListener((changes, namespace) => {
      // Find the new bookmark data
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`
          // `Old value was "${oldValue}", new value is "${newValue}".`
        );
        if (key === "newBookmarkNodes") {
          console.log("Received new bookmark node");
          setNewItems(newValue);
          addNewBookmarkNode(newValue);
        }
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  /**
   * Moves the given items to the primary board (top-level).
   *
   * @param {BookmarkNode[]} items - The list of items to move
   */
  const moveItemsToTopLevel = (items) => {
    console.debug("Moving out the following items:");
    console.debug(items.map((item) => item.id));

    moveItemsIntoContainer(items, ROOT_ID).then((updatedNodes) => {
      const updatedTopLevelNodes = updatedNodes.filter((node) => node.parentId == ROOT_ID);
      // Move the nodes to the top level in the front end after backend has
      // been updated
      setTopLevelItems(updatedTopLevelNodes);
    });
  };

  /**
   *
   * @param {BookmarkNode} itemToMove
   * @param {BookmarkNode} targetItem
   */
  const moveItem = (itemToMove, targetItem) => {
    console.log(`Moving item ${itemToMove.id} (${itemToMove.title}) to index ${targetItem.index}`);
    console.debug(`Target item is type '${targetItem.type}'`);
    switch (targetItem.type) {
      case ItemTypes.EMPTY:
        updateBookmarkNodes([itemToMove.id], (item) => ({
          ...item,
          index: targetItem.index,
        })).then((updatedNodes) => {
          const updatedTopLevelItems = updatedNodes.filter((node) => node.parentId == ROOT_ID);
          setTopLevelItems(updatedTopLevelItems);
        });
        break;
      case ItemTypes.FOLDER:
      case ItemTypes.GROUP:
        moveItemsIntoContainer([itemToMove], targetItem.id).then((updatedNodes) => {
          setTopLevelItems(updatedNodes.filter((node) => node.parentId == ROOT_ID));
        });
        break;
      default:
        console.error("Invalid target item type, could not move");
        break;
    }
  };

  /**
   *
   * @param {object} data
   */
  const createNewGroup = async (data) => {
    console.log("Creating new group");
    console.log(data);

    const availableIndex = getAvailableIndices(topLevelItems, 1)[0];
    const id = await getNewId();

    const newGroup = {
      id,
      index: availableIndex,
      title: data[FORMS.newGroup.name],
      parentId: ROOT_ID,
      type: ItemTypes.GROUP,
      dateAdded: Date.now(),
      children: [],
    };

    const group = await addNewBookmarkNode(newGroup);
    console.log("Successfully added new group");
    console.log(group);
    setTopLevelItems(topLevelItems.concat(group));
  };

  /**
   *
   * @param {string} itemId
   * @param {string} currentType
   */
  const convertContainer = async (itemId, currentType) => {
    if (currentType === ItemTypes.FOLDER) {
      const updatedNodes = await convertFolderToGroup(itemId);
      setTopLevelItems(updatedNodes.filter((node) => node.parentId == ROOT_ID));
      return true;
    }
  };

  const displayedTopLevelItems = useItemsByPage(topLevelItems, page, ITEMS_PER_PAGE);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        {/* <Modal open={newItems.length}>
        New bookmarks have been added!
        {JSON.stringify(newItems)}
      </Modal> */}
        <Navbar
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          createNewGroup={createNewGroup}
        />
        <main>
          <PageBorder page={page} onHover={() => page !== 0 && setPage(page - 1)} left />
          <Board
            items={displayedTopLevelItems}
            moveItemsOut={moveItemsToTopLevel}
            moveItem={moveItem}
            page={page}
            convertContainer={convertContainer}
          />
          <PageBorder page={page} onHover={() => setPage(page + 1)} />
        </main>
      </div>
    </DndProvider>
  );
};

export default App;
