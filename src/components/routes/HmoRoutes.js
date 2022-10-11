import React, { lazy, Suspense } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "components/routes/PrivateRoute";
import { Loader } from "components/Utilities";
import { PageNotFound } from "components/pages";
const HmoDashboard = lazy(() =>
  import("components/pages/hmoPages/HmoDashboard")
);
const Patients = lazy(() => import("components/pages/Patients"));
const SinglePatient = lazy(() => import("components/pages/SinglePatient"));
const PatientProfile = lazy(() => import("components/pages/PatientProfile"));
const Chat = lazy(() => import("components/pages/Chat"));
const Consultations = lazy(() => import("components/pages/Consultations"));
const Prescriptions = lazy(() => import("components/pages/Prescriptions"));
const MedicalRecords = lazy(() => import("components/pages/MedicalRecords"));
const CaseNotes = lazy(() => import("components/pages/CaseNotes"));
const Medications = lazy(() => import("components/pages/Medications"));
const Enrollees = lazy(() => import("components/pages/hmoPages/HmoEnrollees"));
const Plans = lazy(() => import("components/pages/hmoPages/HmoPlans"));
const Settings = lazy(() => import("components/pages/hmoPages/HmoSettings"));
const PatientAppointment = lazy(() =>
  import("components/pages/PatientAppointment")
);
const Hmo = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {/* ====== DASHBOARD ======= */}
        <PrivateRoute
          path={["/", "/dashboard"]}
          exact
          component={HmoDashboard}
        />

        {/* ======== PATIENTS =========== */}
        <PrivateRoute exact path="/patients" component={Patients} />

        <PrivateRoute
          exact
          path="/patients/:patientId"
          component={SinglePatient}
        />

        <PrivateRoute
          exact
          path="/patients/:patientId/profile"
          component={PatientProfile}
        />

        <PrivateRoute
          exact
          path="/patients/:patientId/profile/chat"
          component={Chat}
        />

        <PrivateRoute
          path="/patients/:patientId/consultations"
          exact
          component={Consultations}
        />

        <PrivateRoute
          exact
          path="/patients/:patientId/prescriptions"
          component={Prescriptions}
        />

        <PrivateRoute
          path="/patients/:patientId/appointments"
          component={PatientAppointment}
        />

        <PrivateRoute
          path="/patients/:patientId/records"
          component={MedicalRecords}
        />

        <PrivateRoute
          exact
          path="/patients/:patientId/consultations/case-note/:id"
          component={CaseNotes}
        />

        <PrivateRoute
          path="/patients/:patientId/medications"
          component={Medications}
        />

        {/* ============ ENROLLEES =========== */}
        <PrivateRoute exact path="/enrollees" component={Enrollees} />

        {/* ============ PLANS =========== */}
        <PrivateRoute exact path="/plans" component={Plans} />

        {/* =========== SETTINGS ============== */}
        <PrivateRoute exact path="/settings" component={Settings} />

        <PrivateRoute component={PageNotFound} />
      </Switch>
    </Suspense>
  );
  // }
};

export default Hmo;
