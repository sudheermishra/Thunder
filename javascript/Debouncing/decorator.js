function decorator(func) {
  return function (...args) {
    func.call(this, ...args);
  };
}

function hi(name) {
  console.log("hi", name);
}

const decoratedHi = decorator(hi);
decoratedHi("sudheer");
