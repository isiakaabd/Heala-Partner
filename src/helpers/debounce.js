export const debounce = (func) => {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, 1000);
  };
};

//implement debouce
