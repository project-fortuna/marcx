/**
 * Converts bookmarks
 *
 * @param {chrome.bookmarks.BookmarkTreeNode[]} bookmarks
 */
function flattenTree(bookmarks) {
  const allNodes = [];

  for (let bookmark of bookmarks) {
    if (!bookmark.children) {
      // Leaf node, represents an actual bookmark
      allNodes.push({ ...bookmark, type: "bookmark" });
      continue;
    }

    const childrenIds = bookmark.children.map((child) => child.id);

    // Node has children, represents a folder
    allNodes.push({ ...bookmark, children: childrenIds, type: "folder" });

    // Recurse
    const flatNodes = flattenTree(bookmark.children);
    allNodes.push(...flatNodes);
  }

  return allNodes;
}

/**
 * Runs on first install
 *
 * Flattens the user's bookmarks and separates out the folders from the
 * bookmarks themselves
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed, loading bookmarks");

  await chrome.storage.local.set({ firstUse: true });
  console.debug("Set firstUse to TRUE");

  const chromeBookmarks = await chrome.bookmarks.getTree();

  // Create a deep copy of the Chrome bookmarks
  const chromeBookmarksCopy = structuredClone(chromeBookmarks);
  const flatNodes = flattenTree(chromeBookmarksCopy);
  await chrome.storage.local.set({ bookmarkNodes: flatNodes });
});
