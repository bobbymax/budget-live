import React from "react";
import { useSelector } from "react-redux";
import CustomCard from "../../components/commons/cards/CustomCard";

const BudgetController = ({ userDashboardData }) => {
  const auth = useSelector((state) => state.auth.value.user);

  const {
    paymentForms,
    thirdParty,
    staffPayment,
    aef,
    logisticsRefund,
    reversals,
    pendingTransactions,
    paidTransactions,
    claims,
    retirement,
  } = userDashboardData;

  const cards = [
    {
      title: "No. of Payment Forms",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: paymentForms,
      path: "",
    },
    {
      title: "No. of Third-Party",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: thirdParty,
      path: "",
    },
    {
      title: "No. of Staff Payments",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: staffPayment,
      path: "",
    },
    {
      title: "No. of AEF",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: aef,
      path: "",
    },
    {
      title: "Pending Logistics Refund",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: logisticsRefund,
      path: "",
    },
    {
      title: "No. of Pending Reversals",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: reversals,
      path: "",
    },
    {
      title: "No. of Pending Transactions",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: pendingTransactions,
      path: "",
    },
    {
      title: "No. of Paid Transactions",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: paidTransactions,
      path: "",
    },
    {
      title: "No. of Registered Claims",
      roles: ["staff"],
      count: claims,
      path: "",
    },
    {
      title: "Claims to be Rettired",
      roles: ["staff"],
      count: retirement,
      path: "",
    },
  ];

  return (
    <>
      <div className="row">
        {cards.map(
          (card, i) =>
            auth &&
            auth.roles.some((role) => card.roles.includes(role.label)) && (
              <div className="col-sm-6 col-md-3" key={i}>
                <CustomCard
                  title={card.title}
                  count={card.count}
                  path={card.path}
                />
              </div>
            )
        )}
      </div>
    </>
  );
};

export default BudgetController;
