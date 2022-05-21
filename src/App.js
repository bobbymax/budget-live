/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PreLoader from "./components/commons/PreLoader";
import { routes } from "./routes";

const App = () => {
  return (
    <Suspense fallback={<PreLoader />}>
      <Routes>
        {routes.guest.map((page, i) => (
          <Route exact key={i} path={page.path} element={page.component} />
        ))}
        {routes.protected.map((page, index) => (
          <Route
            key={index}
            exact
            path={page.path}
            element={<ProtectedRoute>{page.component}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default App;
