import { lazy } from "react";

const Login = lazy(() => import("../views/auth/Login"));
const ChangePassword = lazy(() => import("../views/auth/ChangePassword"));
const StaffLoginVerification = lazy(() =>
  import("../views/auth/StaffLoginVerification")
);
const Dashboard = lazy(() => import("../views/Dashboard"));
const Profile = lazy(() => import("../views/Profile"));
const Settings = lazy(() => import("../views/modules/configuration/Settings"));
const Configuration = lazy(() =>
  import("../views/modules/configuration/Configuration")
);
const Modules = lazy(() => import("../views/modules/Modules"));
const Module = lazy(() => import("../views/modules/Module"));
const AddModules = lazy(() =>
  import("../views/modules/administration/AddModules")
);
const Roles = lazy(() => import("../views/modules/administration/Roles"));
const Groups = lazy(() => import("../views/modules/administration/Groups"));
const Departments = lazy(() =>
  import("../views/modules/administration/Departments")
);
const Employees = lazy(() =>
  import("../views/modules/administration/Employees")
);
const BudgetHeads = lazy(() => import("../views/modules/budget/BudgetHeads"));
const Payments = lazy(() => import("../views/modules/budget/Payment"));
const Reversals = lazy(() => import("../views/modules/budget/Reversals"));
const SubBudgetHeads = lazy(() =>
  import("../views/modules/budget/SubBudgetHeads")
);
const Fund = lazy(() => import("../views/modules/budget/Fund"));
const Expenditures = lazy(() => import("../views/modules/budget/Expenditures"));
const BatchPayments = lazy(() =>
  import("../views/modules/budget/BatchPayments")
);
const PreviousBudget = lazy(() =>
  import("../views/modules/budget/PreviousBudget")
);

const Claims = lazy(() => import("../views/modules/staff-services/Claims"));
const Retirement = lazy(() =>
  import("../views/modules/staff-services/Retirement")
);
const MakeRetirement = lazy(() =>
  import("../views/modules/staff-services/MakeRetirement")
);
const Claim = lazy(() => import("../views/modules/staff-services/Claim"));
const TouringAdvance = lazy(() =>
  import("../views/modules/staff-services/TouringAdvance")
);
const Instructions = lazy(() =>
  import("../views/modules/staff-services/Instructions")
);

const GradeLevels = lazy(() =>
  import("../views/modules/structure/GradeLevels")
);
const Wages = lazy(() => import("../views/modules/structure/Wages"));
const Benefits = lazy(() => import("../views/modules/structure/Benefits"));

const Approvals = lazy(() => import("../views/modules/approvals/Approvals"));
const Logistics = lazy(() => import("../views/modules/refunds/Logistics"));
const RefundRequests = lazy(() =>
  import("../views/modules/refunds/RefundRequests")
);

const Overview = lazy(() => import("../views/modules/overview/Overview"));
const OverviewExpenditure = lazy(() =>
  import("../views/modules/overview/OverviewExpenditure")
);

const Dependencies = lazy(() => import("../views/imports/Dependencies"));
const ReportManagement = lazy(() =>
  import("../views/modules/reports/ReportManagement")
);

const TrackPayment = lazy(() =>
  import("../views/modules/tracking/TrackPayment")
);

export const routes = {
  guest: [
    {
      name: "Login",
      component: <Login />,
      path: "/login",
    },
    {
      name: "Staff Login Verification",
      component: <StaffLoginVerification />,
      path: "/auth/login/:staff/:token",
    },
    {
      name: "Change Password",
      component: <ChangePassword />,
      path: "/reset-password",
    },
  ],
  protected: [
    {
      name: "Report Management",
      component: <ReportManagement />,
      path: "/generate/report",
    },
    {
      name: "Dependencies",
      component: <Dependencies />,
      path: "/import/dependencies",
    },
    {
      name: "Retirement",
      component: <Retirement />,
      path: "/retire",
    },
    {
      name: "Fill Retirement",
      component: <MakeRetirement />,
      path: "/retire/:id",
    },
    {
      name: "Touring Advance",
      component: <TouringAdvance />,
      path: "/touring-advance",
    },
    {
      name: "Configuration",
      component: <Configuration />,
      path: "/configuration",
    },
    {
      name: "Staff Profile",
      component: <Profile />,
      path: "/user/profile",
    },
    {
      name: "Overview",
      component: <Overview />,
      path: "/overview",
    },
    {
      name: "Overview Expenditure",
      component: <OverviewExpenditure />,
      path: "/overview/:id/expenditure",
    },
    {
      name: "Modules",
      component: <AddModules />,
      path: "/modules",
    },
    {
      name: "Batch Payments",
      component: <BatchPayments />,
      path: "/batch/claim",
    },
    {
      name: "Refund Requests",
      component: <RefundRequests />,
      path: "/refund/requests",
    },
    {
      name: "Logistics Refund",
      component: <Logistics />,
      path: "/logistics/refund",
    },
    {
      name: "Approve Payments",
      component: <Approvals />,
      path: "/approve/expenditures",
    },
    {
      name: "Staff Benefits",
      component: <Benefits />,
      path: "/benefits",
    },
    {
      name: "Staff Wages",
      component: <Wages />,
      path: "/benefit/wages",
    },
    {
      name: "Grade Levels",
      component: <GradeLevels />,
      path: "/grade-levels",
    },
    {
      name: "Payments",
      component: <Payments />,
      path: "/payments",
    },
    {
      name: "Batch Reversals",
      component: <Reversals />,
      path: "/reversals",
    },
    {
      name: "Staff Claims",
      component: <Claims />,
      path: "/claims",
    },
    {
      name: "Claim Instructions",
      component: <Instructions />,
      path: "/claims/:id/add/details",
    },
    {
      name: "Print Claim",
      component: <Claim />,
      path: "/claims/:id/print",
    },
    {
      name: "Previous Budget",
      component: <PreviousBudget />,
      path: "/previous/budget",
    },
    {
      name: "Expenditures",
      component: <Expenditures />,
      path: "/expenditures",
    },
    {
      name: "Credit Sub Budget Head",
      component: <Fund />,
      path: "/funds",
    },
    {
      name: "Sub Budget Heads",
      component: <SubBudgetHeads />,
      path: "/sub-budget-heads",
    },
    {
      name: "Budget Heads",
      component: <BudgetHeads />,
      path: "/budget-heads",
    },
    {
      name: "Employess",
      component: <Employees />,
      path: "/staff",
    },
    {
      name: "Departments",
      component: <Departments />,
      path: "/departments",
    },
    {
      name: "Groups",
      component: <Groups />,
      path: "/groups",
    },
    {
      name: "Roles",
      component: <Roles />,
      path: "/roles",
    },
    {
      name: "Modules",
      component: <Module />,
      path: "/applications/:id",
    },
    {
      name: "Applications",
      component: <Modules />,
      path: "/applications",
    },
    {
      name: "Settings",
      component: <Settings />,
      path: "/settings",
    },
    {
      name: "Dashboard",
      component: <Dashboard />,
      path: "/",
    },
    {
      name: "Track Payment",
      component: <TrackPayment />,
      path: "/track/payment/:id",
    },
  ],
};
