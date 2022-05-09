import moment from "moment";
import { ToWords } from "to-words";

const toWords = new ToWords({
  localeCode: "en-NG",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  },
});

export const handleSubsCalculations = (args) => {
  let arr = [];
  if (args.length > 0) {
    args.map((arg) => arg && arr.push(arg.fund));
  }

  return (
    arr.length > 0 &&
    arr.reduce((prev, current) => prev + current.actual_expenditure, 0)
  );
};

export const formatConfig = (arr) => {
  const obt = {};

  if (arr.length > 0) {
    arr.forEach((el) => {
      obt[el.key] = el.value;
    });
  }

  return obt;
};

export const levelOptions = (optionsArr) => {
  const arr = [];
  if (optionsArr.length !== 0) {
    optionsArr.forEach((el) => {
      arr.push({ value: el.id, label: el.code });
    });
  } else {
    arr.push({ value: 0, label: "Select Grade Level" });
  }
  return arr;
};

export const getMonthToCurrent = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date();

  return months.slice(0, months[date.getMonth()]);
};

export const formatCurrency = (fig) => {
  let currency = Intl.NumberFormat("en-US");
  return "NGN " + currency.format(fig);
};
export const formatCurrencyWithoutSymbol = (fig) => {
  let currency = Intl.NumberFormat("en-US");
  return currency.format(fig);
};

export const verifyNumOfDays = (started, ended) => {
  const date1 = new Date(started);
  const date2 = new Date(ended);
  const diffTime = Math.abs(date2 - date1);

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const returnArr = (arrs) => {
  const arr = [];

  arrs.forEach((el) => {
    arr.push(el && el.fund.booked_balance);
  });

  return arr;
};

export const search = (str = "", data = []) => {
  let filtered = [];
  if (str !== "" && data.length > 0) {
    filtered = data.filter((row) => {
      return Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(str.toLowerCase());
    });
  } else {
    filtered = data;
  }

  return filtered;
};

export const getPaymentType = (code) => {
  const type = code.substring(0, 2);
  return type === "SP" ? "STAFF PAYMENT" : "THIRD PARTY PAYMENT";
};

export const getPaymentTypeSmall = (code) => {
  const type = code.substring(0, 2);
  return type === "SP" ? "staff-payment" : "third-party";
};

export const formatDate = (date) => {
  return moment(date).format("DD-MMM-YY");
};

export const amountToWords = (amount) => {
  return toWords.convert(amount);
};

export const filterByRef = (arr1, arr2) => {
  let res = [];

  res = arr1.filter((el) => {
    return !arr2.find((element) => {
      return element.grade_level_id === el.value;
    });
  });

  return res;
};

const fetchLabels = (entity) => {
  let enty = [];

  entity.roles.forEach((el) => {
    enty.push(el.label);
  });

  return enty;
};

export const userHasRole = (auth, role) => {
  const authRoles = fetchLabels(auth);
  return authRoles.includes(role);
};

export const elapsed = (batchDate) => {
  const created = new Date(batchDate);
  const now = new Date();
  const msBetweenDates = Math.abs(created.getTime() - now.getTime());
  const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

  return hoursBetweenDates > 24;
};

export const months = {
  short: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  long: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export const approvals = [
  {
    stage: "budget-office",
    role: "budget-office-officer",
    level: 1,
    action: "Clear",
    canQuery: true,
    canModify: false,
  },
  {
    stage: "treasury",
    role: "treasury",
    level: 2,
    action: "Clear",
    canQuery: false,
    canModify: true,
  },
  {
    stage: "audit",
    role: "audit",
    level: 3,
    action: "Clear",
    canQuery: true,
    canModify: true,
  },
  {
    stage: "treasury",
    role: "treasury",
    level: 4,
    action: "Post",
    canQuery: false,
    canModify: false,
  },
];

export const uniqueNumberGenerator = (str) => {
  const paymentType = str === "staff-payment" ? "SP" : "TPP";
  return paymentType + Math.floor(Math.random() * 100000);
};
