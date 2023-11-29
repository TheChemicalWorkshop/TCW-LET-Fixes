// ! get all comment elements on the page
const messages2 = document.querySelectorAll(".Comment");

for (const msg of messages2) { 
  if (msg.querySelectorAll(".Author")[0]) {
    const msgUser = msg.querySelectorAll(".Author")[0].getElementsByTagName('a')[0].getAttribute("title");

    // Retrieve the current list of blocked users from local storage
    browser.storage.local.get({ 'blocked_users': [] }).then(result => {
      const blockedUsers = result.blocked_users;

     

      if (blockedUsers.includes(msgUser)) {
        console.log(`User '${msgUser}' is blocked.`);
        const itemBody = msg.querySelector(".Item-Body");
      
        // Store the original content
        const originalContent = itemBody.innerHTML;
      
        // Set to 'Content blocked'
        itemBody.innerHTML = '<div class="Message userContent"><p>Content blocked ⬅ Click to reveal</p></div>';
      
        // Add click event listener to restore original content
        itemBody.querySelector('.userContent').addEventListener('click', () => {
          itemBody.innerHTML = originalContent;
        });
      } else {
        // Existing code for unblocked users
      }




    });






    // ! makes your own posts different color so you can see what you wrote :)
    // yourself
    // 2F2F33 - red, not the best choice, but works
    if (msgUser == username) {
      msg.style.backgroundColor = "#631A07";
      //msg.style.border = "1px dotted red";
    }

    // // don't tell anyone, let's keep this our secret 😘
    // 1D2040
    if (msgUser == "DeadlyChemist") {
      msg.style.backgroundColor = "#1D2040";
      //msg.style.border = "1px dotted red";
    }

    // * editing dustin to make him visible
    // #6E305E
    if (msgUser == "dustinc") {
      msg.style.backgroundColor = "#6E305E";
      //msg.style.border = "1px dotted red";
    }

  }

  // * makes all @yourname visible
  if ((msg.outerHTML).includes("@" + username)) {
    //msg.style.border = "5px solid red";
    msg.style.backgroundColor = "#404229";
  }

}
