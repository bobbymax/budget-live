import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
      title: "Raised Payments",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "super-administrator",
      ],
      count: paymentForms,
      path: "/payments",
    },
    {
      title: "Third-Party",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "super-administrator",
      ],
      count: thirdParty,
      path: "/expenditures",
    },
    {
      title: "Staff Payments",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "super-administrator",
      ],
      count: staffPayment,
      path: "/expenditures",
    },
    {
      title: "AEF",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
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
        "super-administrator",
      ],
      count: logisticsRefund,
      path: "/logistics/refund",
    },
    {
      title: "Pending Reversals",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "super-administrator",
      ],
      count: reversals,
      path: "/reversals",
    },
    {
      title: "Pending Transactions",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "super-administrator",
      ],
      count: pendingTransactions,
      path: "/payments",
    },
    {
      title: "Paid Transactions",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "super-administrator",
      ],
      count: paidTransactions,
      path: "/payments",
    },
    {
      title: "Registered Claims",
      roles: ["staff"],
      count: claims,
      path: "/claims",
    },
    {
      title: "Claims to be Retired",
      roles: ["staff"],
      count: retirement,
      path: "/retire",
    },
  ];

  return (
    <>
      <div className="row">
        {cards.map(
          (card, i) =>
            auth &&
            auth.roles.some((role) => card.roles.includes(role.label)) &&
            (card.path !== "" ? (
              <div className="col-sm-6 col-md-3" key={i}>
                <Link to={card.path}>
                  <CustomCard
                    title={card.title}
                    count={card.count}
                    path={card.path}
                  />
                </Link>
              </div>
            ) : (
              <div className="col-sm-6 col-md-3" key={i}>
                <CustomCard
                  title={card.title}
                  count={card.count}
                  path={card.path}
                />
              </div>
            ))
        )}
      </div>
    </>
  );
};

export default BudgetController;
