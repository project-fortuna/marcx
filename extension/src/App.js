/*global chrome*/

import React, { useEffect, useState, useMemo } from "react";
import Board from "./components/Board";
import Navbar from "./components/Navbar";
import { getBookmarkNodes } from "./utils/functions";
import { ITEMS_PER_PAGE } from "./utils/types";

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
      const topLevelNodes = res.bookmarkNodes.filter((node) => node.parentId == 0);
      topLevelNodes.push(TEMP_BOOKMARK);

      // Sort the items by index
      topLevelNodes.sort((node1, node2) => node1.index - node2.index);

      console.log(topLevelNodes);

      setTopLevelItems(topLevelNodes);
    });

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

  return (
    <div className="App">
      <Navbar
        page={page}
        onNextPage={() => handleChangePage(page + 1)}
        onPreviousPage={() => handleChangePage(page - 1)}
      />
      <Board items={topLevelItems}></Board>
    </div>
  );
};

export default App;
