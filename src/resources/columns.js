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
