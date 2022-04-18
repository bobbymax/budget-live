/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./views/auth/Login";
import Dashboard from "./views/Dashboard";
import PreLoader from "./components/commons/PreLoader";
import Settings from "./views/modules/configuration/Settings";
import Modules from "./views/modules/Modules";
import Module from "./views/modules/Module";
import Roles from "./views/modules/administration/Roles";
import Groups from "./views/modules/administration/Groups";
import Departments from "./views/modules/administration/Departments";
import Employees from "./views/modules/administration/Employees";
import BudgetHeads from "./views/modules/budget/BudgetHeads";
import Payments from "./views/modules/budget/Payment";
import SubBudgetHeads from "./views/modules/budget/SubBudgetHeads";
import Fund from "./views/modules/budget/Fund";
import Expenditures from "./views/modules/budget/Expenditures";
import Claims from "./views/modules/staff-services/Claims";
import GradeLevels from "./views/modules/structure/GradeLevels";
import Wages from "./views/modules/structure/Wages";
import Benefits from "./views/modules/structure/Benefits";
import Claim from "./views/modules/staff-services/Claim";
import Instructions from "./views/modules/staff-services/Instructions";
import Approvals from "./views/modules/approvals/Approvals";
import Logistics from "./views/modules/refunds/Logistics";
import BatchPayments from "./views/modules/budget/BatchPayments";
import RefundRequests from "./views/modules/refunds/RefundRequests";
import AddModules from "./views/modules/administration/AddModules";
import Overview from "./views/modules/overview/Overview";
import OverviewExpenditure from "./views/modules/overview/OverviewExpenditure";
import Profile from "./views/Profile";
import Configuration from "./views/modules/configuration/Configuration";
import TouringAdvance from "./views/modules/staff-services/TouringAdvance";
import Retirement from "./views/modules/staff-services/Retirement";
// import RetirementDetails from "./views/modules/staff-services/RetirementDetails";
import Dependencies from "./views/imports/Dependencies";
import MakeRetirement from "./views/modules/staff-services/MakeRetirement";
import ChangePassword from "./views/auth/ChangePassword";
import PreviousBudget from "./views/modules/budget/PreviousBudget";

const App = () => {
  return (
    <Suspense fallback={<PreLoader />}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/applications"
          element={
            <ProtectedRoute>
              <Modules />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <Module />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/roles"
          element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/staff"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/budget-heads"
          element={
            <ProtectedRoute>
              <BudgetHeads />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/sub-budget-heads"
          element={
            <ProtectedRoute>
              <SubBudgetHeads />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/funds"
          element={
            <ProtectedRoute>
              <Fund />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/expenditures"
          element={
            <ProtectedRoute>
              <Expenditures />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/previous/budget"
          element={
            <ProtectedRoute>
              <PreviousBudget />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/claims/:id/print"
          element={
            <ProtectedRoute>
              <Claim />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/claims/:id/add/details"
          element={
            <ProtectedRoute>
              <Instructions />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/claims"
          element={
            <ProtectedRoute>
              <Claims />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/grade-levels"
          element={
            <ProtectedRoute>
              <GradeLevels />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/benefit/wages"
          element={
            <ProtectedRoute>
              <Wages />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/benefits"
          element={
            <ProtectedRoute>
              <Benefits />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/approve/expenditures"
          element={
            <ProtectedRoute>
              <Approvals />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/logistics/refund"
          element={
            <ProtectedRoute>
              <Logistics />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/refund/requests"
          element={
            <ProtectedRoute>
              <RefundRequests />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/batch/claim"
          element={
            <ProtectedRoute>
              <BatchPayments />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/modules"
          element={
            <ProtectedRoute>
              <AddModules />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/overview/:id/expenditure"
          element={
            <ProtectedRoute>
              <OverviewExpenditure />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/user/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/configuration"
          element={
            <ProtectedRoute>
              <Configuration />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/touring-advance"
          element={
            <ProtectedRoute>
              <TouringAdvance />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/retire"
          element={
            <ProtectedRoute>
              <Retirement />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/retire/:id"
          element={
            <ProtectedRoute>
              <MakeRetirement />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/import/dependencies"
          element={
            <ProtectedRoute>
              <Dependencies />
            </ProtectedRoute>
          }
        />

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/reset-password" element={<ChangePassword />} />
      </Routes>
    </Suspense>
  );
};

export default App;
