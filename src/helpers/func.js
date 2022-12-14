export const arrangeItems = (array) => {
  let finalArray = [];
  let n = 0;
  let arrayValues = [];
  let arrayObject = {};
  arrayObject.name = undefined;

  // array.sort();
  array.forEach((element) => {
    let container = element.split(":");
    if (arrayObject.name === container[0]) {
      arrayValues.push(container[1]);
      arrayObject.value = arrayValues;
    } else {
      finalArray[n] = arrayObject;
      arrayValues = [];
      arrayObject = {};
      arrayObject.name = container[0];
      arrayValues.push(container[1]);
      arrayObject.value = arrayValues;
      n += 1;
    }
  });
  finalArray.shift();
  return finalArray;
};

export const removeEmptyStringValues = (obj) => {
  try {
    let newObj = {};
    for (const key in obj) {
      if (obj[key] !== "") {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  } catch (err) {
    console.err("error from removeEmptyStringValues FN", err);
    return obj;
  }
};

export const setSideNav = (appNavData, pathname, setNav) => {
  try {
    const pathArr = pathname.split("/");
    if (pathArr.length < 2) {
      setNav(0);
      return;
    }
    // eslint-disable-next-line
    appNavData.map((data) => {
      // eslint-disable-next-line no-restricted-syntax
      if (data.path === `/${pathArr[1]}`) {
        return setNav(data?.id);
      }
    });
  } catch (error) {
    console.log("Something sent wrong with setSideNav FN", error);
  }
};
