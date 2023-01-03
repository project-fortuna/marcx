/*global chrome*/

import React, { useEffect, useState, useMemo } from "react";
import Board from "./components/Board";

const TEMP_BOOKMARK = {
  id: "9999",
  index: 3,
  title: "Test Bookmark",
  url: "https://reactjs.org/docs/hooks-custom.html",
  type: "bookmark",
};

const App = () => {
  const [topLevelItems, setTopLevelItems] = useState(null);
  const [newBookmarkData, setNewBookmarkData] = useState([]);

  const addNewBookmark = (bookmarkData) => {
    console.log("adding new bookmark:", bookmarkData);
    setNewBookmarkData((oldArray) => oldArray.concat(bookmarkData));
  };

  useEffect(() => {
    console.log("Doing initial check for bookmark data");
    chrome.storage.local.get(["newBookmarkData"]).then((data) => {
      console.log("Got", data);
      addNewBookmark(data.newBookmarkData[0]);
    });

    // Get the top level items and group them together

    // Get top level bookmarks
    Promise.all([chrome.storage.local.get("bookmarks"), chrome.storage.local.get("folders")]).then(
      ([bookmarksRes, foldersRes]) => {
        const topLevelBookmarks = bookmarksRes.bookmarks.filter(
          (bookmark) => bookmark.parentId == 0
        );
        topLevelBookmarks.push(TEMP_BOOKMARK);

        const topLevelFolders = foldersRes.folders.filter((folder) => folder.parentId == 0);

        const allItems = topLevelBookmarks.concat(topLevelFolders);

        // Sort the items by index
        allItems.sort((item1, item2) => item1.index - item2.index);

        console.log(allItems);

        setTopLevelItems(allItems);
      }
    );
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
    <div>
      <Board items={topLevelItems}></Board>
      {/* <ul>
        {newBookmarkData.map((data) => (
          <li>
            <code>{JSON.stringify(data)}</code>
          </li>
        ))}
      </ul>
      <button onClick={() => addNewBookmark({ data: "test" })}>Add new bookmark</button>
      <code>{JSON.stringify(bookmarks)}</code>
      <code>{JSON.stringify(folders)}</code> */}
    </div>
  );
};

export default App;
