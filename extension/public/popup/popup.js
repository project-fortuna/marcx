const addBookmarkButton = document.getElementById("add-bookmark");

addBookmarkButton.addEventListener("click", async () => {
  const activeBookmark = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  console.log(activeBookmark);
  await chrome.storage.local.set({ newBookmarkData: activeBookmark });
  chrome.tabs.create({});
});
