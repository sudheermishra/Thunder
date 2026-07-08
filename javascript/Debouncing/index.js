const element = document.querySelector("input");

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

function int(e) {
  console.log(e.target.value);
}
const deboucefunc = debounce(int, 300);

element.addEventListener("input", deboucefunc);
