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
    name: "Budget Office",
    stage: "budget-office",
    role: "budget-office-officer",
    level: 1,
    action: "Clear",
    canQuery: true,
    clearQuery: false,
    canModify: false,
  },
  {
    name: "Treasury",
    stage: "treasury",
    role: "treasury",
    level: 2,
    action: "Clear",
    canQuery: false,
    clearQuery: false,
    canModify: true,
  },
  {
    name: "Audit",
    stage: "audit",
    role: "audit",
    level: 3,
    action: "Clear",
    canQuery: true,
    clearQuery: true,
    canModify: true,
  },
  {
    name: "Treasury",
    stage: "treasury",
    role: "treasury",
    level: 4,
    action: "Post",
    canQuery: false,
    clearQuery: false,
    canModify: false,
  },
];

export const uniqueNumberGenerator = (str) => {
  const paymentType = str === "staff-payment" ? "SP" : "TPP";
  return paymentType + Math.floor(Math.random() * 100000);
};

export const generateReportForPeriod = (funds, date) => {
  let report;
  report = funds?.map((fund) => {
    const booked =
      fund?.expenditures?.length > 0
        ? fund?.expenditures?.filter(
            (exp) =>
              (exp?.status === "batched" ||
                exp?.status === "cleared" ||
                exp?.status === "paid") &&
              new Date(exp?.created_at).getTime() <= new Date(date).getTime()
          )
        : [];

    const actuals = fund?.expenditures?.filter(
      (exp) =>
        exp?.status === "paid" &&
        new Date(exp?.created_at).getTime() <= new Date(date).getTime()
    );

    const totalBookedSpent = booked
      ?.map((exp) => parseFloat(exp?.amount))
      .reduce((sum, current) => sum + current, 0);

    const totalActualSpent = actuals
      ?.map((exp) => parseFloat(exp?.amount))
      .reduce((sum, current) => sum + current, 0);

    const bookedUBalance = parseFloat(fund?.approved_amount) - totalBookedSpent;
    const actualUBalance = parseFloat(fund?.approved_amount) - totalActualSpent;
    const ePerformance =
      (totalBookedSpent / parseFloat(fund?.approved_amount)) * 100;
    const aPerformance =
      (totalActualSpent / parseFloat(fund?.approved_amount)) * 100;

    return {
      ...fund,
      expenditures: booked,
      totalAmountSpent: totalBookedSpent,
      totalActualAmountSpent: totalActualSpent,
      untouchedBalance: bookedUBalance,
      untouchedActualBalance: actualUBalance,
      expected_performance: ePerformance,
      actual_performance: aPerformance,
    };
  });

  return report;
};

export const getBudgetSummation = (funds) => {
  const approved = funds
    ?.map((fund) => parseFloat(fund?.approved_amount))
    .reduce((sum, curr) => sum + curr, 0);
  const booked = funds
    ?.map((fund) => parseFloat(fund?.totalAmountSpent))
    .reduce((sum, curr) => sum + curr, 0);
  const actual = funds
    .map((fund) => parseFloat(fund?.totalActualAmountSpent))
    .reduce((sum, curr) => sum + curr, 0);

  const bookedBalance = funds
    ?.map((fund) => parseFloat(fund?.untouchedBalance))
    .reduce((sum, curr) => sum + curr, 0);

  const actualBalance = funds
    ?.map((fund) => parseFloat(fund?.untouchedActualBalance))
    .reduce((sum, curr) => sum + curr, 0);

  let ePerformance = (booked / approved) * 100;
  let aPerformance = (actual / approved) * 100;
  ePerformance = isNaN(parseFloat(ePerformance)) ? 0 : ePerformance;
  aPerformance = isNaN(parseFloat(aPerformance)) ? 0 : aPerformance;

  const cFunds = funds?.filter((fund) => fund?.budget_type === "capital");
  const rFunds = funds?.filter((fund) => fund?.budget_type === "recursive");
  const pFunds = funds?.filter((fund) => fund?.budget_type === "personnel");

  // Capex Breakdown
  const cApproved = cFunds
    .map((fund) => parseFloat(fund?.approved_amount))
    .reduce((sum, prev) => sum + prev, 0);
  const cBooked = cFunds
    .map((fund) => parseFloat(fund?.totalAmountSpent))
    .reduce((sum, prev) => sum + prev, 0);
  const cPerformance = (cBooked / cApproved) * 100;

  // Recurrent Breakdown
  const rApproved = rFunds
    .map((fund) => parseFloat(fund?.approved_amount))
    .reduce((sum, prev) => sum + prev, 0);
  const rBooked = rFunds
    .map((fund) => parseFloat(fund?.totalAmountSpent))
    .reduce((sum, prev) => sum + prev, 0);
  const rPerformance = (rBooked / rApproved) * 100;

  // Recurrent Breakdown
  const pApproved = pFunds
    .map((fund) => parseFloat(fund?.approved_amount))
    .reduce((sum, prev) => sum + prev, 0);
  const pBooked = pFunds
    .map((fund) => parseFloat(fund?.totalAmountSpent))
    .reduce((sum, prev) => sum + prev, 0);
  const pPerformance = (pBooked / pApproved) * 100;

  return {
    approved,
    booked,
    actual,
    bookedBalance,
    actualBalance,
    ePerformance,
    aPerformance,
    capex: {
      cApproved,
      cBooked,
      cPerformance,
      balance: cApproved - cBooked,
    },
    recurrent: {
      rApproved,
      rBooked,
      rPerformance,
      balance: rApproved - rBooked,
    },
    personnel: {
      pApproved,
      pBooked,
      pPerformance,
      balance: pApproved - pBooked,
    },
  };
};

export const generateMonthlyReport = (funds, budgetHeads, period) => {
  if (funds?.length < 1 || budgetHeads?.length < 1 || period === "") return [];

  let report = [];
  const d = new Date(period);

  budgetHeads?.map((head) => {
    let budgetHeadFunds = funds?.filter(
      (fund) => fund?.budgetHead === head?.name
    );
    const approved = budgetHeadFunds
      ?.map((fund) => parseFloat(fund?.approved_amount))
      .reduce((sum, curr) => sum + curr, 0);

    const computed = budgetHeadFunds.map((fund) => {
      const duringPeriod =
        fund?.expenditures?.length > 0
          ? fund?.expenditures?.filter(
              (exp) =>
                (exp?.status === "batched" ||
                  exp?.status === "cleared" ||
                  exp?.status === "paid") &&
                new Date(exp?.created_at).getTime() <= d.getTime()
            )
          : [];

      const totalAmountSpent = duringPeriod
        ?.map((exp) => parseFloat(exp?.amount))
        .reduce((sum, prev) => sum + prev, 0);

      const untouchedBalance =
        parseFloat(fund?.approved_amount) - totalAmountSpent;

      const performance =
        (totalAmountSpent / parseFloat(fund?.approved_amount)) * 100;

      return {
        ...fund,
        expenditures: duringPeriod,
        totalAmountSpent,
        untouchedBalance,
        expected_performance: performance,
      };
    });

    const totalSpent = computed
      .map((flk) => parseFloat(flk?.totalAmountSpent))
      .reduce((sum, prev) => sum + prev, 0);

    const balance = computed
      .map((fund) => parseFloat(fund?.untouchedBalance))
      .reduce((sum, prev) => sum + prev, 0);

    const actualPerf = (totalSpent / approved) * 100;
    return report.push({
      budgetHead: head?.name,
      totalApproved: approved,
      totalSpent,
      funds: computed,
      balance,
      totalPerf: isNaN(actualPerf) ? 0 : actualPerf,
    });
  });

  return report;
};

export const dependencies = {
  expenditures: [
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "staff_no", label: "STAFF" },
    { key: "department", label: "DEPARTMENT" },
    { key: "claim", label: "CLAIM" },
    { key: "beneficiary", label: "BENEFICIARY" },
    { key: "amount", label: "AMOUNT" },
    { key: "batch_no", label: "BATCH" },
    { key: "description", label: "DESCRIPTION" },
    { key: "type", label: "TYPE" },
    { key: "payment_type", label: "PAYMENT TYPE" },
    { key: "status", label: "STATUS" },
    { key: "budget_year", label: "BUDGET YEAR" },
    { key: "batched", label: "BATCHED" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
    { key: "budget_year", label: "PERIOD" },
  ],
  claims: [
    { key: "id", label: "ID" },
    { key: "staff", label: "STAFF" },
    { key: "title", label: "TITLE" },
    { key: "reference_no", label: "CODE" },
    { key: "total_amount", label: "AMOUNT" },
    { key: "spent_amount", label: "SPENT" },
    { key: "details", label: "DETAILS COUNT" },
    { key: "type", label: "TYPE" },
    { key: "status", label: "STATUS" },
    { key: "rettired", label: "RITIRED" },
    { key: "paid", label: "PAID" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  instructions: [
    { key: "claim", label: "CLAIM" },
    { key: "type", label: "TYPE" },
    { key: "benefit", label: "BENEFIT" },
    { key: "category", label: "CATEGORY" },
    { key: "description", label: "DESCRIPTION" },
    { key: "from", label: "START" },
    { key: "to", label: "END" },
    { key: "amount", label: "AMOUNT" },
  ],
  subBudgetHeads: [
    { key: "budgetId", label: "BUDGET HEAD" },
    { key: "budget_head_name", label: "BUDGET HEAD NAME" },
    { key: "department", label: "DEPARTMENT" },
    { key: "code", label: "BUDGET CODE" },
    { key: "name", label: "NAME" },
    { key: "type", label: "TYPE" },
    { key: "logistics", label: "LOGISTICS BUDGET" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  budgetHeads: [
    { key: "budgetId", label: "HEAD" },
    { key: "name", label: "NAME" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  staff: [
    { key: "staff_no", label: "STAFF ID" },
    { key: "firstname", label: "FIRSTNAME" },
    { key: "middlename", label: "MIDDLENAME" },
    { key: "surname", label: "SURNAME" },
    { key: "grade_level", label: "GRADE LEVEL" },
    { key: "department", label: "DEPARTMENT" },
    { key: "email", label: "EMAIL" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  funds: [
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "approved_amount", label: "APPROVED" },
    { key: "booked_expenditure", label: "COMMITMENT" },
    { key: "actual_expenditure", label: "ACTUALS" },
    { key: "booked_balance", label: "BOOKED BALANCE" },
    { key: "actual_balance", label: "ACTUAL BALANCE" },
    { key: "budget_owner", label: "OWNER" },
    { key: "budget_year", label: "BUDGET YEAR" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  modules: [],
  departments: [
    { key: "name", label: "NAME" },
    { key: "code", label: "CODE" },
    { key: "type", label: "TYPE" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  roles: [
    { key: "name", label: "NAME" },
    { key: "max_slots", label: "SLOTS" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  logistics: [
    { key: "bco", label: "BCO" },
    { key: "staff", label: "STAFF" },
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "department", label: "DEPARTMENT" },
    { key: "amount", label: "AMOUNT" },
    { key: "status", label: "STATUS" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  touringAdvances: [
    { key: "controller", label: "STAFF" },
    { key: "reference_no", label: "CLAIM" },
    { key: "status", label: "STATUS" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  reversals: [
    { key: "staff", label: "STAFF" },
    { key: "batch_no", label: "BATCH" },
    { key: "description", label: "DESCRIPTION" },
    { key: "status", label: "STATUS" },
    { key: "closed", label: "CLOSED" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
  refunds: [
    { key: "expenditure_id", label: "EXPENDITURE" },
    { key: "department", label: "DEPARTMENT" },
    { key: "beneficiary", label: "BENEFICIARY" },
    { key: "amount", label: "AMOUNT" },
    { key: "subBudgetHeadCode", label: "BUDGET CODE" },
    { key: "creditBudgetCode", label: "CREDIT HEAD CODE" },
    { key: "description", label: "DESCRIPTION" },
    { key: "status", label: "STATUS" },
    { key: "closed", label: "CLOSED" },
    { key: "budget_year", label: "BUDGET YEAR" },
    { key: "created_at", label: "CREATED AT" },
    { key: "updated_at", label: "UPDATED AT" },
  ],
};

export const fetchers = [
  {
    key: "expenditures",
    value: "Expenditures",
    cloumns: dependencies.expenditures,
  },
  {
    key: "claims",
    value: "Claims",
    cloumns: dependencies.claims,
  },
  {
    key: "instructions",
    value: "Instructions",
    cloumns: dependencies.instructions,
  },
  {
    key: "budget-heads",
    value: "Budget Heads",
    cloumns: dependencies.budgetHeads,
  },
  {
    key: "sub-budget-heads",
    value: "Sub Budget Heads",
    cloumns: dependencies.subBudgetHeads,
  },
  {
    key: "staff",
    value: "Staff",
    cloumns: dependencies.staff,
  },
  {
    key: "funds",
    value: "Funds",
    cloumns: dependencies.funds,
  },
  {
    key: "departments",
    value: "Departments",
    cloumns: dependencies.departments,
  },
  {
    key: "roles",
    value: "Roles",
    cloumns: dependencies.roles,
  },
  {
    key: "logistics",
    value: "Logistics",
    cloumns: dependencies.logistics,
  },
  {
    key: "touring-advances",
    value: "Touring Advances",
    cloumns: dependencies.touringAdvances,
  },
  {
    key: "reversals",
    value: "Reversals",
    cloumns: dependencies.reversals,
  },
  {
    key: "refunds",
    value: "Refunds",
    cloumns: dependencies.refunds,
  },
];
