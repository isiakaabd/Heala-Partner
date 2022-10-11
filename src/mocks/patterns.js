const hospitalPatterns = {
  // PATIENTS PATTERNS
  Patients: "patients",
  "Patient view": "patients/{id}",
  "Patient Profile": "patients/{id}/profile",
  chat: "patients/{id}/profile/chat",

  // DOCTORS PATTERNS
  Doctors: "hcps",
  "Doctor view": "hcps/{id}",
  "Doctor profile": "hcps/{id}/profile",
  Earnings: "hcps/{id}/earnings",
  Data: "hcps/{id}/earnings/earn",
  Payout: "hcps/{id}/earnings/payout",
  Availibility: "hcps/{id}/availability",
  "Doctor patients": "hcps/{id}/doctor-patients",
  "Send message": "hcps/{id}/profile/chat",

  // WHITE LABEL PATTERNS
  "White labels": "label",
  "User types": "label/types",
  Providers: "label/provider",

  // FINANCE PATTERS
  Finance: "finance",
  "Earnings table": "finance/earnings",
  Payouts: "finance/payouts",
  "Subscriptions Earnings table": "finance/sub-income",

  // REFERRALS PATTERNS
  Referrals: "referrals",
  Referral: "referrals/{id}",
  // Validations
  Validations: "validations",
  //SETTINGS PATTERNS
  Settings: "hospital-settings",
  "Hospital profile": "hospital-settings/profile",

  Subscriptions: "plans",

  // GENERIC PATTERNS
  Records: "{id}/records",
  Medications: "{id}/medications",
  Appointments: "{id}/appointments",
  Prescriptions: "{id}/prescriptions",
  Consultations: "{id}/consultations",
  "Consultation Details": "consultations/case-note/{id}",
};

const diagnosticsPatterns = {
  "Test referrals": "pending",
  Test: "pending/{id}/request",
  "Scheduled Tests": "schedule",
  "Test detail": "schedule/{id}/schedule",
  "Completed test": "completed",
  "Completed test detail": "completed/{id}/view",
  "Cancelled tests": "cancelled",
  Settings: "setting",
};

const pharmacyPatterns = {
  "Pending order": "pending-order",
  Order: "pending-order/{id}",
  "Processing orders": "processing-order",
  "Completed orders": "completed-order",
  "Order information": "completed-order/{id}/order",
  "Cancelled orders": "cancelled-order",
  Settings: "settings",
  Profile: "settings/profile",
};

const hmoPatterns = {
  // PATIENTS PATTERNS
  Patients: "patients",
  "Patient view": "patients/{id}",
  "Patient Profile": "patients/{id}/profile",
  chat: "patients/{id}/profile/chat",

  // ENROLLEES
  Enrollees: "enrollees",

  // ENROLLEES
  Plans: "plans",

  //SETTINGS PATTERNS
  Settings: "settings",
};

export default Object.freeze({
  hospitalPatterns,
  diagnosticsPatterns,
  pharmacyPatterns,
  hmoPatterns,
});
