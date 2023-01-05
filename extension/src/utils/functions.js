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
