import moment from "moment";

export const dateMoment = (dateString) => {
  return moment(dateString).utc().format("DD-MM-YYYY");
};
export const timeMoment = (dateString) => {
  return moment(dateString).format("hh:mm A");
};
export const time = (dateString) => {
  return moment(dateString).format("YYYY-MM-DD HH:mm");
};
export const timeConverter = (str) => {
  const date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
};

export const roundUp = (num) => {
  return Math.round(num * 10) / 10;
};

export const hours = (z) => {
  let time = z?.split(":")[0];
  if (time < 12) return `${z} AM`;
  if (time > 12) {
    let newTime = +time - 12;
    return `${newTime} PM`;
  } else return `${time} Noon`;
};

export const daily = (value) => {
  let result = "";
  if (value === 1) result = "daily";
  else result = `${value} days`;
  return result;
};
export const duration = (value) => {
  let result = "";
  if (value === 1) result = "once";
  if (value === 2) result = "twice";
  if (value === 3) result = "thrice";
  else if (value > 3) result = `${value} times`;
  return result;
};

export const returnpercent = (a, b) => {
  //% Increase/Decrease = (present m(onth total - past month total) / past month total × 100
  try {
    const percent = ((b - a) / a) * 100;
    return percent || 0;
  } catch (error) {
    console.error("Error from returnPercent function", error);
    return 0;
  }
};
export const financialPercent = (a, b) => {
  return Math.round((a / (b + a)) * 100);
};
export const partnersOptions = [
  { key: "Patients", value: "Patients" },
  { key: "Doctors", value: "Doctors" },
  { key: "Consultations", value: "Consultations" },
  { key: "Subscribers", value: "Subscribers" },
  { key: "Finance", value: "Finance" },
];

export const selectOptions = [
  { key: "Months", value: "0" },
  { key: "Jan", value: "1" },
  { key: "Feb", value: "2" },
  { key: "Mar", value: "3" },
  { key: "Apr", value: "4" },
  { key: "May", value: "5" },
  { key: "Jun", value: "6" },
  { key: "Jul", value: "7" },
  { key: "Aug", value: "8" },
  { key: "Sept", value: "9" },
  { key: "Oct", value: "10" },
  { key: "Nov", value: "11" },
  { key: "Dec", value: "12" },
];
export const newOptions = [
  { key: "All Stats", value: "all" },
  { key: "Active", value: "active" },
  { key: "Inactive", value: "inactive" },
];
export const days = [
  { key: "Sunday", value: "Sunday" },
  { key: "Monday", value: "Monday" },
  { key: "Tuesday", value: "Tuesday" },
  { key: "Wednesday", value: "Wednesday" },
  { key: "Thursday", value: "Thursday" },
  { key: "Friday", value: "Friday" },
  { key: "Saturday", value: "Saturday" },
];
export const today = () => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const d = new Date();
  return weekday[d.getDay()];
};
export const financeOptions = [
  { key: "All Stats", value: "all" },
  { key: "Earnings", value: "Earnings" },
  { key: "Payouts", value: "Payouts" },
];
export const consultationsOptions = [
  { key: "All Stats", value: "all" },
  { key: "Accepted", value: "Accepted" },
  { key: "Completed", value: "Completed" },
  { key: "Declined", value: "Declined" },
  { key: "Ongoing", value: "Ongoing" },
  { key: "Cancelled", value: "Cancelled" },
];
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};
export const unformat = (amount, locale) => {
  let thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, "");
  let decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    amount
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ",")
  );
};
export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const getErrors = (error) => {
  return error?.networkError?.result?.errors[0].message;
};
