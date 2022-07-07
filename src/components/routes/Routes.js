import React, { lazy, Suspense } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "components/routes/PrivateRoute";
import { PageNotFound } from "components/pages";
import { Loader } from "components/Utilities";
const Dashboard = lazy(() => import("components/pages/Dashboard"));
const PendingOrder = lazy(() => import("components/pages/PendingOrder"));
const ProcessingOrders = lazy(() =>
  import("components/pages/ProcessingOrders")
);
const CompletedOrders = lazy(() => import("components/pages/CompletedOrders"));
const ViewCompleted = lazy(() => import("components/pages/ViewCompleted"));
const CancelledOrders = lazy(() => import("components/pages/CancelledOrders"));
const Settings = lazy(() => import("components/pages/Settings"));
const Profile = lazy(() => import("components/pages/Profile"));
const PendingOrderProfile = lazy(() =>
  import("components/pages/PendingOrderProfile")
);

const Routes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <PrivateRoute path={["/", "/dashboard"]} exact component={Dashboard} />

        <PrivateRoute exact path="/pending-order" component={PendingOrder} />

        <PrivateRoute
          exact
          path="/pending-order/:orderId"
          component={PendingOrderProfile}
        />

        <PrivateRoute
          exact
          path="/pending-order/:orderId/order"
          component={PendingOrderProfile}
        />

        <PrivateRoute
          exact
          path="/processing-order"
          component={ProcessingOrders}
        />

        <PrivateRoute
          exact
          path="/completed-order"
          component={CompletedOrders}
        />

        <PrivateRoute
          exact
          path="/completed-order/:orderId/order"
          component={ViewCompleted}
        />

        {/* ViewCompleted */}

        <PrivateRoute
          exact
          path="/cancelled-order"
          component={CancelledOrders}
        />

        <PrivateRoute exact path="/settings" component={Settings} />

        <PrivateRoute path="/settings/profile" component={Profile} />
        <PrivateRoute path="*" component={PageNotFound} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
