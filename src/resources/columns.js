export const columns = {
  staff: [
    {
      Header: "Staff Number",
      accessor: "staff_no",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
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
      Header: "Code",
      accessor: "budgetCode",
    },
    {
      Header: "Name",
      accessor: "name",
    },
  ],
};
