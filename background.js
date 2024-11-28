browser.menus.create({
    id: "tcw-block_let_user",
    title: "Block User",
    contexts: ["link"],
    targetUrlPatterns: ["https://lowendtalk.com/profile/*"]
  });
  
  browser.menus.create({
    id: "tcw-unblock_let_user",
    title: "Unblock User",
    contexts: ["link"],
    targetUrlPatterns: ["https://lowendtalk.com/profile/*"]
  });
  
  browser.menus.onClicked.addListener(async function (info, tab) {
    if (info.linkUrl) {
      const username = info.linkUrl.split('/profile/')[1];
  
      if (info.menuItemId === "tcw-block_let_user") {
        // Block user
        blockUser(username);
      } else if (info.menuItemId === "tcw-unblock_let_user") {
        // Unblock user
        unblockUser(username);
      }
    }
  });
  
  function blockUser(username) {
    // Retrieve the current list of blocked users from local storage
    browser.storage.local.get({ 'blocked_users': [] }).then(result => {
      let blockedUsers = result.blocked_users;
  
      // Check if the username is not already in the list
      if (!blockedUsers.includes(username)) {
        // Add the username to the list
        blockedUsers.push(username);
  
        // Update the local storage with the modified list
        browser.storage.local.set({ 'blocked_users': blockedUsers });
  
        // Log the updated list to the console (optional)
        console.log('Blocked Users:', blockedUsers);
      }
    });
  }
  
  function unblockUser(username) {
    // Retrieve the current list of blocked users from local storage
    browser.storage.local.get({ 'blocked_users': [] }).then(result => {
      let blockedUsers = result.blocked_users;
  
      // Check if the username is in the list
      const index = blockedUsers.indexOf(username);
      if (index !== -1) {
        // Remove the username from the list
        blockedUsers.splice(index, 1);
  
        // Update the local storage with the modified list
        browser.storage.local.set({ 'blocked_users': blockedUsers });
  
        // Log the updated list to the console (optional)
        console.log('Blocked Users:', blockedUsers);
      }
    });
  }
  
  // Pre-configured selectors
const defaultSelectors = [
  { name: '@DeadlyChemist', color: '#1D2040', ignore: false },
  { name: '%yourself%', color: '#404229', ignore: false },
  { name: '%ping%', color: '#404229', ignore: false },
];

// Handle first-time installation
browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
      console.log('Extension installed for the first time.');
      
      // Check if selectors already exist (to avoid overwriting user data)
      const { selectors = [] } = await browser.storage.local.get('selectors');
      
      if (selectors.length === 0) {
          // Set default selectors if none exist
          await browser.storage.local.set({ selectors: defaultSelectors });
          console.log('Default selectors added.');
      }
  }
});