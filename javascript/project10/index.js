const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const element = document.querySelector("h2");

let intervalId;
let startTime;
let elapsedTime = 0;

start.addEventListener("click", () => {
  if (intervalId) {
    return;
  }
  // setInterval ek id deta h jisko humne ek variable me store kra liya ab woh id pass kr denge clearInterval me
  startTime = Date.now() - elapsedTime;

  intervalId = setInterval(() => {
    elapsedTime = Date.now() - startTime;

    let current = elapsedTime;

    let hours = String(Math.floor(current / (1000 * 60 * 60))).padStart(2, "0");
    current %= 1000 * 60 * 60;

    let minute = String(Math.floor(current / (1000 * 60))).padStart(2, "0");
    current %= 1000 * 60;

    let second = String(Math.floor(current / 1000)).padStart(2, "0");

    element.textContent = `${hours} : ${minute} : ${second}`;
  }, 1000);
});

stop.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = null;
  start.textContent = "Resume";
});
