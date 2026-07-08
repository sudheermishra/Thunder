async function gitHub(number = 20) {
  const element = document.getElementById("root");
  // taaki yeh function call ho jab phle yeh empty after that jo bhi value pass hui function me woh chali jaye
  element.textContent = "";

  const response = await fetch(
    `https://api.github.com/users?per_page=${number}`,
  );
  const data = await response.json();
  console.log(data);

  for (const user of data) {
    //  image
    let img = document.createElement("img");
    img.src = user.avatar_url;

    // name
    let name = document.createElement("h2");
    name.textContent = user.login;

    // card
    let container = document.createElement("div");
    container.append(img, name);
    // container.append(name);

    element.append(container);
  }
}

gitHub();

const btn = document.querySelector("button");
const input = document.querySelector("input");

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

function findSuggestion(e) {
  // const number = Number(input.value);
  gitHub(Number(e.target.value));
}

const debounceFunc = debounce(findSuggestion, 300);

btn.addEventListener("click", () => {
  const number = Number(input.value);
  gitHub(number);
});

input.addEventListener("input", debounceFunc);
