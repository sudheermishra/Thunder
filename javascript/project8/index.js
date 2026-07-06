const element = document.querySelector("h1");

// har ek second ke is call back function ko run krega
setInterval(() => {
  let date = new Date();
  let time = date.toLocaleString();
  element.textContent = time;
}, 1000);

// seTimeout sir ek baar hi call krega ek second ke baad
// setTimeout(() => {
//   let date = new Date();
//   let time = date.toLocaleString();
//   element.textContent = time;
// }, 1000);
