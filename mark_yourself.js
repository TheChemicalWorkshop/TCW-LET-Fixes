(async () => {
  // Fetch username (current logged-in user), default to "%username%" if not found
  const username = document.querySelector("a.Username:nth-child(1)")?.innerHTML || "%username%";
  console.log(`Username detected: ${username}`);

  // Fetch configuration (selectors) from storage
  const { selectors = [] } = await browser.storage.local.get('selectors');

  // Helper function to find a selector by name
  const findSelector = (name) => selectors.find(selector => selector.name === name);

  // Get the `%yourself%` configuration
  const yourselfSelector = findSelector('%yourself%');
  const pingSelector = findSelector('%ping%');

  // Get all comment elements on the page
  const messages = document.querySelectorAll(".Comment");
  if (messages.length === 0) {
    console.log("No comments found");
  }

  // Process each message
  for (const msg of messages) {
    const authorElement = msg.querySelector(".Author a[title]");
    const roleElement = msg.querySelector(".Item-Header .AuthorWrap span.MItem.RoleTitle");
    if (authorElement) {
      const msgUser = authorElement.getAttribute("title");
      console.log(msgUser)

      // Check if this is a user selector (starts with @)
      const userSelector = findSelector(`@${msgUser}`);

      // If `ignore` is true, treat as spammy message (hide content and show a "click to reveal" message)
      if (userSelector?.ignore) {
        console.log(`Ignoring user: ${msgUser}`);
        const itemBody = msg.querySelector(".Item-Body");
        const originalContent = itemBody.innerHTML;

        // Hide content and show the "Content blocked" message
        itemBody.innerHTML = '<div class="Message userContent"><p>Content blocked ⬅ Click to reveal</p></div>';

        // Add click event listener to restore original content
        itemBody.querySelector('.userContent').addEventListener('click', () => {
          itemBody.innerHTML = originalContent;
        });
        continue; // Skip further processing for ignored users
      }

      // Apply user selector settings if matched and not ignored
      if (userSelector) {
        msg.style.backgroundColor = userSelector.color || "#ffffff";
      }

      // Highlight your own posts using `%yourself%` selector
      if (msgUser === username && yourselfSelector && !yourselfSelector.ignore) {
        msg.style.backgroundColor = yourselfSelector.color || "#631A07"; // Default fallback color
      }
    }

    // Check for role-based selectors (starts with # or ##)
    if (roleElement) {
      const userRoles = roleElement.textContent.trim().split(",");  // Split roles by comma

      // Process each role
      userRoles.forEach(role => {
        const roleSelector = findSelector(`#${role.trim()}`); // For standard role (#role)
        const exclusiveRoleSelector = findSelector(`##${role.trim()}`); // For exclusive role (##role)

        //console.log("roleSelector", roleSelector)
        //console.log("exclusiveRoleSelector", exclusiveRoleSelector)
        //console.log("------")
        // If the role has an `ignore` flag, treat it as spammy message
        if (roleSelector?.ignore) {
          console.log(`Ignoring role: ${role.trim()}`);
          const itemBody = msg.querySelector(".Item-Body");
          const originalContent = itemBody.innerHTML;

          // Hide content and show the "Content blocked" message for ignored roles
          itemBody.innerHTML = '<div class="Message userContent"><p>Content blocked ⬅ Click to reveal</p></div>';

          // Add click event listener to restore original content for ignored roles
          itemBody.querySelector('.userContent').addEventListener('click', () => {
            itemBody.innerHTML = originalContent;
          });

        }

        // Apply standard role selector settings if matched and not ignored
        if (roleSelector && !roleSelector.ignore) {
          msg.style.backgroundColor = roleSelector.color;
        }

        // Apply exclusive role selector settings if matched and not ignored, and ensure the user has only this role
        if (exclusiveRoleSelector) {

          if (exclusiveRoleSelector && !exclusiveRoleSelector.ignore) {
            // Ensure the user has exactly this role and no other roles
            if (userRoles.length === 1 && userRoles[0].trim() === role.trim()) {
              msg.style.backgroundColor = exclusiveRoleSelector.color; // Exclusive role fallback color
            }
          }
          if (exclusiveRoleSelector.ignore) {
            // Ensure the user has exactly this role and no other roles
            if (userRoles.length === 1 && userRoles[0].trim() === role.trim()) {
              const itemBody = msg.querySelector(".Item-Body");
              const originalContent = itemBody.innerHTML;
              
              // Hide content and show the "Content blocked" message for ignored roles
              itemBody.innerHTML = '<div class="Message userContent"><p>Content blocked ⬅ Click to reveal</p></div>';
              
              // Add click event listener to restore original content for ignored roles
              itemBody.querySelector('.userContent').addEventListener('click', () => {
                itemBody.innerHTML = originalContent;
              });
            }
          }
        }
      });
    }

    // Highlight mentions of the username in messages using `%username%` selector
    if (msg.outerHTML.includes(`@${username}`)) {
      msg.style.backgroundColor = pingSelector.color || "#404229"; // Default highlight color for mentions
    }
  }

  // Handle spammy messages (e.g., h1 elements inside .userContent)
  const spammyMessages = document.querySelectorAll(".userContent");
  for (const spammyMsg of spammyMessages) {
    const spammySelector = findSelector("spammyMessages");

    if (spammySelector?.ignore) {
      spammyMsg.style.opacity = "0.3";
      spammyMsg.style.fontSize = "small";
      spammyMsg.style.backgroundColor = spammySelector.color || "#eeeeee"; // Default spammy background
    }

    // Make all h1 tags inside spammy messages smaller
    const h1Elements = spammyMsg.getElementsByTagName("h1");
    for (const h1Element of h1Elements) {
      h1Element.style.fontSize = "12px";  // Set a smaller font size for h1
    }
  }

})();