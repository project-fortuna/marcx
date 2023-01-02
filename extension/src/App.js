/*global chrome*/

import React, { useEffect, useState, useMemo } from "react";

const App = () => {
  const [bookmarks, setBookmarks] = useState(null);
  const [folders, setFolders] = useState(null);
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

    // Get top level bookmarks
    chrome.storage.local.get("bookmarks").then((res) => {
      const topLevelBookmarks = res.bookmarks.filter((bookmark) => bookmark.parentId == 0);
      setBookmarks(topLevelBookmarks);
    });

    // Get top level folders
    chrome.storage.local.get("folders").then((res) => {
      const topLevelFolders = res.folders.filter((folder) => folder.parentId == 0);
      setFolders(topLevelFolders);
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
    <div>
      Hello World, this is a test
      <ul>
        {newBookmarkData.map((data) => (
          <li>
            <code>{JSON.stringify(data)}</code>
          </li>
        ))}
      </ul>
      <button onClick={() => addNewBookmark({ data: "test" })}>Add new bookmark</button>
      <code>{JSON.stringify(bookmarks)}</code>
      <code>{JSON.stringify(folders)}</code>
    </div>
  );
};

export default App;
