import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import EventBusySharpIcon from "@mui/icons-material/EventBusySharp";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import DashboardIcon from "components/Icons/DashboardIcon";
import DoctorsIcon from "components/Icons/DoctorsIcon";
import FinanceIcon from "components/Icons/FinanceIcon";
import PatientsIcon from "components/Icons/PatientsIcon";
import SettingsIcon from "components/Icons/SettingsIcon";
import RefferalsIcon from "components/Icons/RefferalsIcon";
import SubscriptionIcon from "components/Icons/SubscriptionIcon";

export const pharmacyMenu = [
  { id: 0, title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
  {
    id: 1,
    title: "Pending Orders",
    icon: <AccessTimeFilledIcon />,
    path: "/pending-order",
  },
  {
    id: 2,
    title: "Processing Orders",
    icon: <UpdateRoundedIcon />,
    path: "/processing-order",
  },
  {
    id: 3,
    title: "Completed orders",
    icon: <CheckCircleSharpIcon />,
    path: "/completed-order",
  },
  {
    id: 5,
    title: "Cancelled Orders",
    icon: <EventBusySharpIcon />,
    path: "/cancelled-order",
  },

  { id: 11, title: "Settings", icon: <SettingsIcon />, path: "/settings" },
];
export const diagnosticsMenu = [
  { id: 0, title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
  {
    id: 1,
    title: "Test Referrals",
    icon: <AccessTimeFilledIcon />,
    path: "/pending",
  },
  {
    id: 2,
    title: "Scheduled Tests",
    icon: <InsertInvitationOutlinedIcon />,
    path: "/schedule",
  },
  {
    id: 3,
    title: "Completed Tests",
    icon: <CheckCircleSharpIcon />,
    path: "/completed",
  },

  {
    id: 5,
    title: "Cancelled Tests",
    icon: <EventBusySharpIcon />,
    path: "/cancelled",
  },

  { id: 11, title: "Settings", icon: <SettingsIcon />, path: "/setting" },
];
// export const x = [
//   { id: 0, title: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
//   { id: 1, title: "Patients", icon: PatientsIcon, path: "/patients" },
//   { id: 2, title: "Doctors", icon: DoctorsIcon, path: "/hcps" },
//   // { id: 5, title: 'Messages', icon: BsChatDotsFill, path: '/messages' },
//   { id: 8, title: "Finance", icon: FinanceIcon, path: "/finance" },
//   { id: 9, title: "Referrals", icon: RefferalsIcon, path: "/referrals" },
//   { id: 10, title: "Subscription", icon: SubscriptionIcon, path: "/plans" },
//   { id: 11, title: "Settings", icon: SettingsIcon, path: "/hospital-settings" },
// ];

export const hospitalMenu = [
  {
    id: 0,
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    id: 1,
    title: "Patients",
    icon: <PatientsIcon />,
    path: "/patients",
  },
  {
    id: 2,
    title: "Doctors",
    icon: <DoctorsIcon />,
    path: "/hcps",
  },

  {
    id: 8,
    title: "Finance",
    icon: <FinanceIcon />,
    path: "/finance",
  },
  {
    id: 9,
    title: "Referrals",
    icon: <RefferalsIcon />,
    path: "/referrals",
  },
  {
    id: 10,
    title: "Subscription Plans",
    icon: <SubscriptionIcon />,
    path: "/plans",
  },
  {
    id: 11,
    title: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
];
