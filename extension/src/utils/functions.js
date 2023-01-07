/*global chrome*/

import { BookmarkNode } from "./types";

/**
 * Gets bookmark nodes from Chrome storage based on a matching function.
 *
 * @param {function} matchingFn - Function that takes in a bookmark node and
 *    returns True or False. Only bookmark nodes that pass this matching
 *    function will be returned.
 * @returns {BookmarkNode[]} The list of bookmark nodes
 */
export async function getBookmarkNodes(matchingFn) {
  const res = await chrome.storage.local.get("bookmarkNodes");
  const filteredNodes = res.bookmarkNodes.filter(matchingFn);
  return filteredNodes;
}

export async function addNewBookmarkNode(item) {
  const res = await chrome.storage.local.get("bookmarkNodes");
  const currentNodes = res.bookmarkNodes;
  await chrome.storage.local.set({ bookmarkNodes: currentNodes.concat(item) });
}

/**
 *
 * @param {string[]} itemIds
 * @param {function} updateFn - Function that takes in an item/bookmark node and
 *    returns the updated item
 */
export async function updateBookmarkNodes(itemIds, updateFn) {
  const res = await chrome.storage.local.get("bookmarkNodes");
  const currentNodes = res.bookmarkNodes;
  const updatedNodes = currentNodes.map((item) => {
    if (itemIds.includes(item.id)) {
      console.log("Updating");
      return updateFn(item);
    }
    return item;
  });

  await chrome.storage.local.set({ bookmarkNodes: updatedNodes });

  return updatedNodes;
}
