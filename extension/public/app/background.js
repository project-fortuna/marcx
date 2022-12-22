chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "Hi :)",
  });
});

console.log(chrome.bookmarks);
