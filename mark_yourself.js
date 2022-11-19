// ! get your own username
const username = (document.querySelectorAll("a.Username:nth-child(1)")[0].innerHTML);
console.log(username)

// ! get all comment elements on the page
const messages = document.querySelectorAll(".Comment");

// ! get all comments on the page
// ! this will be changed
const spammyMessages = document.querySelectorAll(".userContent");






for (const msg of messages) { 
  //console.log(msg.outerHTML); 

  if (msg.querySelectorAll(".Author")[0]) {

    const msgUser = msg.querySelectorAll(".Author")[0].getElementsByTagName('a')[0].getAttribute("title");

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



// ! makes the h1 tags less visible, a lot of work to be done here actually
for (const spammyMsg of spammyMessages) { 
  var h1Elements = spammyMsg.getElementsByTagName("h1");
  for (const h1Element of h1Elements) {
    //h1Element.style.color = "#FF0000";
    //h1Element.style.border = "3px solid darkgreen";
    h1Element.style.opacity = "0.3";
    h1Element.style.fontSize = "small";
  }

}


