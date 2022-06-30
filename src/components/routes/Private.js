import React, { lazy, Suspense } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "components/routes/PrivateRoute";
import { PageNotFound } from "components/pages";
import { Loader } from "components/Utilities";
const Dashboards = lazy(() => import("components/pages/Dashboards"));
const CancelledOrder = lazy(() => import("components/pages/CancelledOrder"));
const Pending = lazy(() => import("components/pages/Pending"));
const PendingProfile = lazy(() => import("components/pages/PendingProfile"));
const CompletedOrder = lazy(() => import("components/pages/CompletedOrder"));
const ViewResult = lazy(() => import("components/pages/ViewResult"));
const Setting = lazy(() => import("components/pages/Setting"));
const Profiles = lazy(() => import("components/pages/Profiles"));
const ScheduledRequestProfile = lazy(() =>
  import("components/pages/ScheduledRequestProfile")
);
const ScheduledRequest = lazy(() =>
  import("components/pages/ScheduledRequest")
);

const Private = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <PrivateRoute path={["/", "/dashboard"]} exact component={Dashboards} />

        <PrivateRoute exact path="/pending" component={Pending} />

        <PrivateRoute
          exact
          path="/pending/:requestId/request"
          component={PendingProfile}
        />

        <PrivateRoute exact path="/schedule" component={ScheduledRequest} />

        <PrivateRoute
          exact
          path="/schedule/:scheduleId/schedule"
          component={ScheduledRequestProfile}
        />

        <PrivateRoute exact path="/completed" component={CompletedOrder} />
        <PrivateRoute
          exact
          path="/completed/:completeId/view"
          component={ViewResult}
        />

        <PrivateRoute exact path="/cancelled" component={CancelledOrder} />
        <PrivateRoute exact path="/setting" component={Setting} />

        <PrivateRoute path="/setting/profile" component={Profiles} />
        <PrivateRoute path="*" component={PageNotFound} />
      </Switch>
    </Suspense>
  );
};

export default Private;
