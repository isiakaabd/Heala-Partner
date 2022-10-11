/* ============ FILTER VALUES ========== */

export const genderType = [
  { key: "Male", value: "Male" },
  { key: "Female", value: "Female" },
];

export const planFilterBy = [
  { key: "Basic", value: "Basic" },
  { key: "Premium", value: "Premium" },
  { key: "Diamond", value: "Diamond" },
];

export const statusFilterBy = [
  { key: "blocked", value: "Blocked" },
  { key: "Active", value: "Active" },
];

export const docVerifyStatusFilterBy = [
  { key: "Verified", value: true },
  { key: "Not Verified", value: false },
];

export const patientsFilterBy = {
  gender: "",
  status: "",
  provider: "",
  plan: "",
};

export const specializationFilterBy = [
  { key: "Hospital", value: "hospital" },
  { key: "Pharmacy", value: "pharmacy" },
  { key: "Diagnostics", value: "diagnostics" },
];

export const cadreFilterBy = [
  { key: "Consultant", value: "Consultant" },
  { key: "House Officer", value: "House Officer" },
  { key: "Registrar", value: "Registrar" },
  { key: "Senior Registrar", value: "Senior Registrar" },
];
export const defaultPageInfo = {
  totalDocs: 0,
  limit: 10,
  offset: null,
  hasPrevPage: false,
  hasNextPage: true,
  page: 1,
  totalPages: 9,
  pagingCounter: 1,
  prevPage: null,
  nextPage: 2,
};
export const searchOptions = [
  { key: "By ID", value: "id" },
  { key: "By first name", value: "firstName" },
  { key: "By last name", value: "lastName" },
];
export const providerFilterBy = [
  { key: "Heala", value: "Heala" },
  { key: "No provider", value: "No provider" },
];

export const roleFilterBy = [
  { key: "user", value: "user" },
  { key: "success", value: "success" },
  { key: "failed", value: "failed" },
];

export const payoutFilterBy = [
  { key: "Pending", value: "Pending" },
  { key: "Success", value: "Success" },
  { key: "Failed", value: "Failed" },
];

export const referralFilterBy = [{ key: "diagnostics", value: "diagnostics" }];

/* ================ FILTER DEFAULT VALUES ==================== */

export const doctorsPageDefaultFilterValues = {
  gender: "",
  status: "",
  provider: "",
  cadre: "",
  specialization: "",
};

export const patientsPageDefaultFilterValues = {
  gender: "",
  status: "",
  provider: "",
  plan: "",
};

export const docVerifyPageDefaultFilterValues = {
  status: "",
};

export const emailPageDefaultFilterValues = {
  role: "",
};

export const payoutPageDefaultFilterValues = {
  status: "",
};

export const referralPageDefaultFilterValues = {
  type: "",
};

export const docSpecializationsOptions = [
  { key: "diagnostics", value: "diagnostics" },
  { key: "pharmacy", value: "pharmacy" },
];

export const addDocInitialValues = {
  firstName: "",
  lastName: "",
  specialization: "",
  image: null,
  cadre: "",
  gender: "",
  hospital: "",
  phone: "",
  dob: null,
  dociId: "",
};

export const docCadreOptions = [
  { key: "1", value: "1" },
  { key: "2", value: "2" },
  { key: "3", value: "3" },
  { key: "4", value: "4" },
  { key: "5", value: "5" },
];

/* ========= TYPES ============ */

export const paginationActionTypes = Object.freeze({
  FIRSTPAGE: "FIRSTPAGE",
  NEXTPAGE: "NEXTPAGE",
  PREVPAGE: "PREVPAGE",
  LASTPAGE: "LASTPAGE",
});
export const patientSearchOptions = [
  { key: "By ID", value: "id" },
  { key: "By first name", value: "firstName" },
  { key: "By last name", value: "lastName" },
];
export const patientsProfileDefaultFilterByValues = {
  gender: "",
  provider: "",
};
export const doctorsSearchOptions = [
  { key: "By ID", value: "id" },
  { key: "By first name", value: "firstName" },
  { key: "By last name", value: "lastName" },
];
export const cadreOptions = [
  {
    key: "House Officer",
    value: "House Officer",
  },
  {
    key: "Medical officer (MO)",
    value: "Medical officer (MO)",
  },
  {
    key: "Registrar",
    value: "Registrar",
  },
  {
    key: "Senior Registrar",
    value: "Senior Registrar",
  },
  {
    key: "Consultant",
    value: "Consultant",
  },
];
export const doctorsProfileDefaultFilterByValues = {
  gender: "",
  cadre: "",
  specialization: "",
  providerId: "",
};
export const specializationOptions = [
  { key: "Internal medicine", value: "Internal medicine" },
  { key: "Family medicine", value: "Family medicine" },
  { key: "General Practitioner (GP)", value: "General Practitioner (GP)" },
  { key: "Pediatrics", value: "Pediatrics" },
  { key: "Emergency medicine", value: "Emergency medicine" },
  { key: "Obstetrics gynecology", value: "Obstetrics gynecology" },
  { key: "Neurology", value: "Neurology" },
  { key: "Geriatrics", value: "Geriatrics" },
  { key: "Psychiatry", value: "Psychiatry" },
  { key: "Anesthesiology", value: "Anesthesiology" },
  { key: "Cardiology", value: "Cardiology" },
  { key: "Dermatology", value: "Dermatology" },
  { key: "Intensive medicine", value: "Intensive medicine" },
  { key: "Endocrinology", value: "Endocrinology" },
  { key: "Radiology", value: "Radiology" },
  { key: "Otorhinolaryngology", value: "Otorhinolaryngology" },
  { key: "Ophthalmology", value: "Ophthalmology" },
  { key: "Oncology", value: "Oncology" },
  { key: "General surgery", value: "General surgery" },
  { key: "Gynaecology", value: "Gynaecology" },
  { key: "Infectious disease", value: "Infectious disease" },
  { key: "Rheumatology", value: "Rheumatology" },
  { key: "Nephrology", value: "Nephrology" },
  { key: "Infectious disease", value: "Infectious disease" },
  { key: "Pulmonology", value: "Pulmonology" },
  { key: "Gastroenterology", value: "Gastroenterology" },
  { key: "Osteopathy", value: "Osteopathy" },
  { key: "Clinical  physiology", value: "Clinical physiology" },
  { key: "Allergology", value: "Allergology" },
  { key: "Adolescent medicine ", value: "Adolescent medicine " },
  { key: "Aviation medicine", value: "Aviation medicine" },
  {
    key: "Child and adolescent psychiatry",
    value: "Child and adolescent psychiatry",
  },
  { key: "occupational medicine ", value: "occupational medicine " },
  { key: "Neonatology", value: "Neonatology" },
];

export const addHMOEnrolleInitialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  hmoId: "",
  noc: "",
  plan: "",
  planId: "",
  expiryDate: "",
};

export const hmoSearchFilterOptions = {
  hmoId: "SDT07657",
  firstName: "John",
  lastName: "Doe",
  plan: "Plan name",
};

export const hmoSearchOptions = [
  { key: "By HMO ID", value: "hmoId" },
  { key: "By first name", value: "firstName" },
  { key: "By last name", value: "lastName" },
  { key: "By HMO plan", value: "plan" },
];

export const planMockData = {
  data: {
    getPlans: {
      plan: [
        {
          _id: "6315c425a9c245001362bd99",
          name: "Silver",
          providerData: null,
          amount: 0,
          description:
            "This plan allows you to have up to 40 consultations in a year",
          provider: null,
          duration: null,
          createdAt:
            "Mon Sep 05 2022 09:40:53 GMT+0000 (Coordinated Universal Time)",
          updatedAt:
            "Mon Sep 05 2022 09:40:53 GMT+0000 (Coordinated Universal Time)",
          __typename: "Plan",
        },
        {
          _id: "6313aa86a9c245001362b206",
          name: "One-off Consultation",
          providerData: null,
          amount: 0,
          description: "For emergency consultations",
          provider: null,
          duration: null,
          createdAt:
            "Sat Sep 03 2022 19:27:03 GMT+0000 (Coordinated Universal Time)",
          updatedAt:
            "Mon Sep 12 2022 18:48:57 GMT+0000 (Coordinated Universal Time)",
          __typename: "Plan",
        },
        {
          _id: "6311ecb1a9c245001362a6f8",
          name: "Consultation Only Plan",
          providerData: {
            _id: "630c74c6460b4f00138998ee",
            name: "Google HMO",
            icon: "https://dq1z5gvyi71s7.cloudfront.net/Capturea.JPG",
            userTypeId: "61ed2b68e6091400135e3dba",
            createdAt:
              "Mon Aug 29 2022 08:11:50 GMT+0000 (Coordinated Universal Time)",
            updatedAt:
              "Mon Aug 29 2022 08:11:50 GMT+0000 (Coordinated Universal Time)",
            email: "fakegoogleHMO@gmail.com",
            phone: "08123456787",
            address: "google does not have a location",
          },
          amount: 0,
          description: "Unlimited access to consultations",
          provider: "630c74c6460b4f00138998ee",
          duration: null,
          createdAt:
            "Fri Sep 02 2022 11:44:49 GMT+0000 (Coordinated Universal Time)",
          updatedAt:
            "Thu Sep 15 2022 10:24:59 GMT+0000 (Coordinated Universal Time)",
          __typename: "Plan",
        },
        {
          _id: "630270c311414f0013f2bb65",
          name: "Sapphire",
          providerData: {
            _id: "62e2399c2e8afb00139b325c",
            name: "Heala HMO",
            icon: "https://dq1z5gvyi71s7.cloudfront.net/hmo-logo-1.png",
            iconAlt: "https://dq1z5gvyi71s7.cloudfront.net/hmo-logo-2.png",
            userTypeId: "61ed2b68e6091400135e3dba",
            createdAt:
              "Thu Jul 28 2022 07:24:12 GMT+0000 (Coordinated Universal Time)",
            updatedAt:
              "Sat Aug 13 2022 20:13:03 GMT+0000 (Coordinated Universal Time)",
          },
          amount: 0,
          description: "One time consultation with a doctor",
          provider: "62e2399c2e8afb00139b325c",
          duration: "Consultations",
          createdAt:
            "Sun Aug 21 2022 17:52:03 GMT+0000 (Coordinated Universal Time)",
          updatedAt:
            "Tue Sep 06 2022 16:23:04 GMT+0000 (Coordinated Universal Time)",
          __typename: "Plan",
        },
      ],
      pageInfo: {
        totalDocs: 4,
        limit: 10,
        offset: null,
        hasPrevPage: false,
        hasNextPage: false,
        page: 1,
        totalPages: 1,
        pagingCounter: 1,
        prevPage: null,
        nextPage: null,
        __typename: "PageInfo",
      },
      __typename: "PlanConnection",
    },
  },
};

export const hmoGraphStateOptions = [
  { key: "Patients", value: "patients" },
  { key: "Enrollees", value: "enrollees" },
  { key: "Consultations", value: "consultations" },
];

export const hmoConsultationsOptions = [
  { key: "All Stats", value: "all" },
  { key: "Accepted", value: "accepted" },
  { key: "Completed", value: "completed" },
  { key: "Declined", value: "declined" },
  { key: "Ongoing", value: "ongoing" },
  { key: "Cancelled", value: "cancelled" },
];

export const mockOpt = {
  patients: {
    all: "total",
    active: "totalActive",
    inactive: "totalInactive",
  },
  enrollees: {
    all: "total",
    active: "totalActive",
    inactive: "totalInactive",
  },
  consultations: {
    all: "total",
    accepted: "totalAccepted",
    completed: "totalCompleted",
    declined: "totalDeclined",
    ongoing: "totalOngoing",
    cancelled: "totalCancelled",
  },
};
