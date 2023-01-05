/*global chrome*/

import React, { useEffect, useState, useMemo } from "react";
import Board from "./components/Board";
import Navbar from "./components/Navbar";
import { getBookmarkNodes } from "./utils/functions";
import { ITEMS_PER_PAGE, BookmarkNode, ROOT_ID } from "./utils/types";

const TEMP_BOOKMARK = {
  id: "9999",
  index: 3,
  title: "Test Bookmark",
  url: "https://reactjs.org/docs/hooks-custom.html",
  type: "bookmark",
};

const App = () => {
  const [page, setPage] = useState(0);
  const [topLevelItems, setTopLevelItems] = useState(null);
  const [newBookmarkData, setNewBookmarkData] = useState([]);

  const addNewBookmark = (bookmarkData) => {
    console.log("adding new bookmark:", bookmarkData);
    setNewBookmarkData((oldArray) => oldArray.concat(bookmarkData));
  };

  /**
   * Handles a page change to the new page index.
   *
   * Gets the top level items (groups/bookmarks/folders) displayed on that page
   * from local storage and updates the appropriate state
   *
   * @param {number} newPageIdx - The new page index
   */
  const handleChangePage = async (newPageIdx) => {
    // TODO: Make sure bookmark nodes are sorted by index
    const newTopLevelItems = await getBookmarkNodes(
      (bookmarkNode) =>
        bookmarkNode.parentId == 0 &&
        // Get only the items on the new page
        bookmarkNode.index >= newPageIdx * ITEMS_PER_PAGE &&
        bookmarkNode.index < (newPageIdx + 1) * ITEMS_PER_PAGE
    );

    // Update state
    setPage(newPageIdx);
    setTopLevelItems(newTopLevelItems);
  };

  useEffect(() => {
    console.log("Doing initial check for bookmark data");
    chrome.storage.local.get(["newBookmarkData"]).then((data) => {
      console.log("Got", data);
      addNewBookmark(data.newBookmarkData[0]);
    });

    // Get top level bookmark nodes (folders, groups, bookmarks)
    chrome.storage.local.get("bookmarkNodes").then((res) => {
      const topLevelNodes = res.bookmarkNodes.filter((node) => node.parentId == ROOT_ID);
      topLevelNodes.push(TEMP_BOOKMARK);

      // Sort the items by index
      topLevelNodes.sort((node1, node2) => node1.index - node2.index);

      console.log(topLevelNodes);

      setTopLevelItems(topLevelNodes);
    });

    // Add chrome storage changed
    const listener = chrome.storage.onChanged.addListener((changes, namespace) => {
      // Find the new bookmark data
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
        if (key === "newBookmarkData") {
          addNewBookmark(newValue[0]);
        }
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  const getNextTopLevelIndex = () => {
    return Math.max(...topLevelItems.map((item) => item.index)) + 1;
  };

  /**
   *
   * @param {string[]} itemIds - The list of item IDs to move
   */
  const moveItemsToTopLevel = (itemIds) => {
    console.debug("Moving out the following items:");
    console.debug(itemIds);

    let newStartIndex = getNextTopLevelIndex();

    // Change the parent ID to the top level ID
    chrome.storage.local.get("bookmarkNodes").then((res) => {
      const newTopLevelNodes = [];
      const updatedNodes = res.bookmarkNodes.map((node) => {
        // Only update the given nodes
        if (itemIds.includes(node.id)) {
          const updatedNode = { ...node, parentId: ROOT_ID, index: newStartIndex };
          newTopLevelNodes.push(updatedNode);
          newStartIndex++;
          return updatedNode;
        }
        return node;
      });

      chrome.storage.local.set({ bookmarkNodes: updatedNodes }, () => {
        // Move the nodes to the top level in the front end after backend has
        // been updated
        console.debug("New top level nodes:", newTopLevelNodes);
        // TODO: If more top level nodes are added than fit on the current page,
        // make sure that they don't get displayed on the current page
        setTopLevelItems(topLevelItems.concat(newTopLevelNodes));
      });
    });
  };

  return (
    <div className="App">
      <Navbar
        page={page}
        onNextPage={() => handleChangePage(page + 1)}
        onPreviousPage={() => handleChangePage(page - 1)}
      />
      <Board items={topLevelItems} moveItemsOut={moveItemsToTopLevel}></Board>
    </div>
  );
};

export default App;
