export const columns = {
  staff: [
    {
      field: "staff_no",
      header: "Staff NUmber",
      isSortable: true,
      currency: false,
    },
    {
      field: "name",
      header: "Name",
      isSortable: true,
      currency: false,
    },
    {
      field: "email",
      header: "Email",
      isSortable: true,
      currency: false,
    },
  ],
  overview: [
    {
      field: "budgetCode",
      header: "Code",
      isSortable: true,
      currency: false,
    },
    {
      field: "name",
      header: "Budget",
      isSortable: true,
      currency: false,
    },
    {
      field: "approved_amount",
      header: "Approved",
      isSortable: false,
      currency: false,
      approved_currency: true,
    },
    {
      field: "booked_expenditure",
      header: "Commitment",
      isSortable: false,
      currency: true,
    },
    {
      field: "actual_expenditure",
      header: "Actual",
      isSortable: false,
      currency: true,
    },
    {
      field: "booked_balance",
      header: "Booked Balance",
      isSortable: false,
      approved_currency: true,
    },
    {
      field: "actual_balance",
      header: "Actual Balance",
      isSortable: false,
      currency: true,
    },
    {
      field: "expected_performance",
      header: "Expected Performance",
      isSortable: false,
      currency: false,
      performance: true,
    },
    {
      field: "actual_performance",
      header: "Actual Performance",
      isSortable: false,
      currency: false,
      performance: true,
    },
  ],
  recons: [
    {
      Header: "Budget Code",
      accessor: "expSubBudgetHead",
    },
    {
      Header: "Beneficiary",
      accessor: "beneficiary",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Date Raised",
      accessor: "requested_at",
    },
    {
      Header: "Fulfilled At",
      accessor: "fulfilled_at",
    },
  ],
  payments: [
    {
      Header: "Budget Code",
      accessor: "subBudgetHeadCode",
    },
    {
      Header: "Batch Code",
      accessor: "batch_no",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Department",
      accessor: "department",
    },
    {
      Header: "Initiator",
      accessor: "raised_by",
    },
    {
      Header: "Date Raised",
      accessor: "raised_at",
    },
  ],
  subBudgetHeads: [
    {
      field: "budgetCode",
      header: "Code",
      isSortable: true,
      currency: false,
    },
    {
      field: "name",
      header: "Name",
      isSortable: true,
      currency: false,
    },
  ],
};
