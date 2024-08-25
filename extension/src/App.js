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
  overwriteBookmarkNodes,
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

import { useSelector, useDispatch } from "react-redux";
import { updateTopLevelItems } from "./app/slices/topLevelItems";
import NewItemModals from "./components/NewItemModals";

const App = () => {
  const [page, setPage] = useState(0);
  const topLevelItems = useSelector((state) => state.topLevelItems);
  const dispatch = useDispatch();

  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    console.log("Doing initial check for bookmark data");
    chrome.storage.local.get(["newBookmarkNodes"]).then((res) => {
      setNewItems(res.newBookmarkNodes);
    });

    // Get ALL top level bookmark nodes (folders, groups, bookmarks)
    getBookmarkNodes().then((nodes) => {
      dispatch(updateTopLevelItems(nodes));
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
   *
   * @param {object} newItem
   */
  const createNewItem = async (newItem) => {
    console.log("Creating new item");
    console.log(newItem);

    const availableIndex = getAvailableIndices([...topLevelItems], 1)[0];
    const id = await getNewId();

    // New item with default fields, can be overwritten by the incoming item
    // object
    const itemToAdd = {
      id,
      index: availableIndex,
      title: "No title",
      parentId: ROOT_ID,
      type: ItemTypes.EMPTY,
      dateAdded: Date.now(),
      ...newItem,
    };

    const addedItem = await addNewBookmarkNode(itemToAdd);
    console.log(`Successfully added new ${addedItem.type}`);
    console.log(addedItem);
    if (addedItem.parentId == ROOT_ID) {
      dispatch(updateTopLevelItems(topLevelItems.concat(addedItem)));
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
        <NewItemModals />
        <Navbar
          page={page}
          onNextPage={() => setPage(page + 1)}
          onPreviousPage={() => setPage(page - 1)}
          createNewItem={createNewItem}
        />
        <main>
          <PageBorder page={page} onHover={() => page !== 0 && setPage(page - 1)} left />
          <Board items={displayedTopLevelItems} page={page} id={ROOT_ID} />
          <PageBorder page={page} onHover={() => setPage(page + 1)} />
        </main>
      </div>
    </DndProvider>
  );
};

export default App;
