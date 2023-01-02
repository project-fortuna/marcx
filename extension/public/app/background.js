/**
 * Converts bookmarks
 *
 * @param {chrome.bookmarks.BookmarkTreeNode[]} bookmarks
 */
function flattenTree(bookmarks) {
  const allBookmarks = [];
  const allFolders = [];

  for (let bookmark of bookmarks) {
    if (!bookmark.children) {
      // Leaf node, represents an actual bookmark
      allBookmarks.push(bookmark);
      continue;
    }

    const childrenIds = bookmark.children.map((child) => child.id);

    // Node has children, represents a folder
    allFolders.push({ ...bookmark, children: childrenIds });

    // Recurse
    const [flatChildren, flatFolders] = flattenTree(bookmark.children);
    allBookmarks.push(...flatChildren);
    allFolders.push(...flatFolders);
  }

  return [allBookmarks, allFolders];
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
  const [flatBookmarks, flatFolders] = flattenTree(chromeBookmarksCopy);
  await chrome.storage.local.set({ bookmarks: flatBookmarks, folders: flatFolders });
});
