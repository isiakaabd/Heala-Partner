import MomentAdapter from "@date-io/moment";
import DateFnsAdapter from "@date-io/date-fns";
import axios from "axios";
import { mockOpt } from "./mockData";
const moment = new MomentAdapter();
const dateFns = new DateFnsAdapter();

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

export const formatDate = (date, formatType) => {
  try {
    //const initialDateFnsDate = dateFns.date(`${date}`);
    const parsedDate = Date.parse(date);
    const formatedDate = dateFns.format(parsedDate, formatType);
    return formatedDate;
  } catch (error) {
    console.error(error);
    return "No date";
  }
};

export const getInitials = (name) => {
  try {
    const splitedNamesArr = name.split(" ");

    const initailsArr = splitedNamesArr.map((name) => {
      const splitedNameArr = name.split("");
      return splitedNameArr[0];
    });

    return initailsArr.join("");
  } catch (error) {
    console.error("error from getInitials func.", error);
    return "";
  }
};

export const dateMoment = (dateString) => {
  const formatedDate = moment(dateString).utc().format("YYYY-MM-DD");
  if (formatedDate === "Invalid date") {
    return null;
  } else {
    return formatedDate;
  }
};

export const isFile = (file, fileType) => {
  try {
    const fileArr = file?.name.split(".");
    const lastItem = fileArr[fileArr.length - 1];
    if (lastItem === fileType) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("couldn't check file type", error);
    return false;
  }
};

export const uploadFile = async (file) => {
  try {
    const form = new FormData();
    form.append("file", file);
    const data = await axios({
      method: "post",
      url: "https://api.heala.io/rest/media/upload/",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      },
      data: form,
    });
    return data.data.data.mediaUrl;
  } catch (error) {
    console.error(error);
  }
};

export const IsImg = (file) => {
  const imgFormatsRegex = new RegExp(
    /(jpeg|png|jpg|webp|jpg|jpeg|jfif|pjpeg|pjp|svg)/
  );
  try {
    const fileArr = file?.name.split(".");
    const lastItem = fileArr[fileArr.length - 1];
    if (imgFormatsRegex.test(lastItem)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("couldn't check if file is an image", error);
    return false;
  }
};

export const getDynamicSearchPlaceholder = (
  filterBy,
  obj = { hmoId: "Search by HMO ID" }
) => {
  let placeHolder = "";
  Object.keys(obj).forEach((key) => {
    if (key === filterBy) placeHolder = obj[key];
  });
  return placeHolder;
};

export const trucateString = (word, length, startFrom = "front") => {
  try {
    const wordArr = word.split("");
    if (wordArr.length <= length) {
      return word;
    }
    if (startFrom === "front") {
      const newWord = `${wordArr.slice(0, length).join("")}...`;
      return newWord;
    }

    if (startFrom === "back") {
      const newWord = `...${wordArr
        .slice(wordArr.length - length, wordArr.length - 1)
        .join("")}`;
      return newWord;
    }
  } catch (error) {
    console.error("Error from trucateString FN", error);
    return word;
  }
};

export const selectNum = (num) => {
  try {
    const remaining = `${num / 4}`.split(".")[1];

    switch (remaining) {
      case undefined:
        return 3;

      case "5":
        return 1;

      case "75":
        return 2;

      case "25":
        return 0;

      default:
        return 0;
    }
  } catch (error) {
    console.error("Error from selectNum func.", error);
    return 1;
  }
};

export const pickHmoPlans = (planArray, names) => {
  try {
    const pickedPlans = planArray.map((plan) => {
      const valuesArr = names.map((name) => {
        return { [name]: plan[name] };
      });
      let combinedObj = {};
      for (let index = 0; index < valuesArr.length; index++) {
        combinedObj = { ...combinedObj, ...valuesArr[index] };
      }
      return combinedObj;
    });

    return pickedPlans;
  } catch (error) {
    console.error("Error from pickHmoPlans function", error);
    return planArray;
  }
};

export const changeGraphTotal = (stats, type, option) => {
  try {
    return stats?.[mockOpt[type]?.[option]];
  } catch (error) {
    console.error("Error from changeGraphTotal FN", error);
    return 0;
  }
};
