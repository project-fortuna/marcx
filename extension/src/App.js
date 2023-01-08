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
} from "./utils/functions";
import {
  ITEMS_PER_PAGE,
  BookmarkNode,
  ROOT_ID,
  TEST_GROUP,
  TEST_BOOKMARK,
  ItemTypes,
} from "./utils/types";

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
      // FIXME: Remove this after testing
      topLevelNodes.push(TEST_GROUP);
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
   * Handles a page change to the new page index.
   *
   * @param {number} newPageIdx - The new page index
   */
  const handleChangePage = (newPageIdx) => {
    // Update state
    setPage(newPageIdx);
  };

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
        moveItemsIntoContainer([itemToMove], targetItem.id);
        break;
      default:
        console.error("Invalid target item type, could not move");
        break;
    }
  };

  /**
   * Variable that stores only the top level items that should be displayed
   * (i.e., the top level items on the current page)
   */
  const displayedTopLevelItems = useMemo(() => {
    if (!topLevelItems) {
      return [];
    }

    const currentPageItems = topLevelItems.filter(
      (item) =>
        // Get only the items on the current page
        item.index >= page * ITEMS_PER_PAGE && item.index < (page + 1) * ITEMS_PER_PAGE
    );

    // Sort the items by index
    currentPageItems.sort((node1, node2) => node1.index - node2.index);

    return currentPageItems;
  }, [topLevelItems, page]);

  return (
    <div className="App">
      {/* <Modal open={newItems.length}>
        New bookmarks have been added!
        {JSON.stringify(newItems)}
      </Modal> */}
      <Navbar
        page={page}
        onNextPage={() => handleChangePage(page + 1)}
        onPreviousPage={() => handleChangePage(page - 1)}
      />
      <Board
        items={displayedTopLevelItems}
        moveItemsOut={moveItemsToTopLevel}
        moveItem={moveItem}
      />
    </div>
  );
};

export default App;
