import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Divider } from "@mui/material";
import PropTypes from "prop-types";
// import GroupIcon from "@mui/icons-material/Group";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  returnpercent,
  financeOptions,
  consultationsOptions,
  newOptions,
  formatNumber,
  partnersOptions,
  selectOptions,
} from "components/Utilities/Time";
import { CardItem } from "components/layouts";
import { CustomSelect } from "components/validation/Select";
import { ReactComponent as ConsultationIcon } from "assets/images/totalC.svg";
import { ReactComponent as DoctorIcon } from "assets/images/totalD.svg";
import { ReactComponent as PatientIcon } from "assets/images/totalP.svg";
import { ReactComponent as PartnerIcon } from "assets/images/totalPartner.svg";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { LineChart2, CircularProgressBar } from "components/Utilities";
import "chartjs-plugin-style";
import { ArrowDownwardOutlined } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  chartCard: {
    // background: "#fff",
    borderRadius: "1rem",
  },
  chartImg: {
    maxWidth: "100%",
  },
  headerGrid: {
    background: "rgb(253, 253, 253)",
    width: "100%",
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
    padding: "1.5rem 2rem",
  },
  overviewGrid: {
    padding: "4rem 2rem 3rem",
  },
  groupIconGrid: {
    width: "5rem",
    height: "5rem",
    background: theme.palette.common.lightGreen,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  groupIcon: {
    "&.MuiSvgIcon-root": {
      fontSize: "2.5rem",
    },
  },
  bottomChartGrid: {
    padding: "3rem 2rem",
  },

  dottedCircle: {
    width: 12,
    height: 12,
    border: "4px solid",
    borderRadius: "50%",
  },
  red: {
    borderColor: theme.palette.common.red,
  },
  green: {
    borderColor: theme.palette.common.green,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  greenIconBg: {
    background: theme.palette.common.lightGreen,
  },
  redIconBg: {
    background: theme.palette.common.lightRed,
  },

  greenNotificationBg: {
    background: theme.palette.common.green,
  },

  notificationIcon: {
    "&.MuiSvgIcon-root": {
      color: "#fff",
    },
  },
  gold: {
    borderColor: theme.palette.common.gold,
  },
}));

const HopsitalDashboardChart = ({ data }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [patients, setPatients] = useState([]);
  const activeSub = data?.subscriptionStats?.totalActive;
  const inActiveSub = data?.subscriptionStats?.totalInactive;
  const [doctorStats, setDoctorStats] = useState([]);
  const [financeState, setFinancialStates] = useState(0);
  const [payoutArray] = useState(data?.payoutStats?.chartData);
  const [patientGraphState] = useState({
    state: "all",
    data: {
      active: data?.patientStats.activeChartData,
      inactive: data?.patientStats.inactiveChartData,
    },
  });
  const [subscribersState] = useState({
    state: "all",
    data: {
      active: data?.subscriptionStats.activeChartData,
      inactive: data?.patientStats.inactiveChartData,
    },
  });
  const [state, setState] = useState(patientGraphState);
  const [totalEarning, setTotalEarning] = useState(0);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [totalPayoutValue, setPayoutValue] = useState(totalPayouts);
  const [options, setOptions] = useState("all");
  const [totalConsultations, setTotalConsultations] = useState("");
  const [partnersState, setPartnersState] = useState("Patients");
  const handleStateChange = (e) => {
    const { value } = e.target;

    switch (value) {
      case "Patients":
        setState(patientGraphState);
        setPartnersState("Patients");
        setOptions("all");
        break;
      case "Doctors":
        setState(graphState);
        setPartnersState("Doctors");
        setOptions("all");
        break;
      case "Consultations":
        setState(consultationState);
        setPartnersState("Consultations");
        setOptions("all");
        break;
      case "Subscribers":
        setState(subscribersState);
        setPartnersState("Subscribers");
        setOptions("all");
        break;
      case "Finance":
        setState(financialState);
        setPartnersState("Finance");
        setOptions("all");
        break;
      default:
        setState(patientGraphState);
        setPartnersState("Patients");
        setOptions("all");
    }
  };
  const handleOptionChange = (e) => {
    const { value } = e.target;
    setOptions(value);
  };

  const [earningArray] = useState(data?.earningStats?.chartData);
  const [consultationState] = useState({
    state: "all",
    data: {
      complete: data?.consultationStats.completedChartData,
      ongoing: data?.consultationStats.ongoingChartData,
      accept: data?.consultationStats.acceptedChartData,
      decline: data?.consultationStats.declinedChartData,
      cancel: data?.consultationStats.cancelledChartData,
    },
  });
  const [totalEarningsValue, setEarningsValue] = useState(totalEarning);
  const [financialState] = useState({
    state: "all",
    data: {
      earning: data?.earningStats?.chartData,
      payout: data?.payoutStats?.chartData,
    },
  });
  const [graphState] = useState({
    state: "all",
    data: {
      active: data?.doctorStats.activeChartData,
      inactive: data?.doctorStats.inactiveChartData,
    },
  });
  const handleFinanceStateChange = (e) => {
    const { value } = e.target;
    // eslint-disable-next-line
    payoutArray?.map((item) => {
      // eslint-disable-next-line
      if (value == 0) {
        setFinancialStates(0);
        setPayoutValue(totalPayouts);
        setEarningsValue(totalEarning);
      }
      //eslint-disable-next-line
      if (item.month == value && value > 0) {
        setFinancialStates(value);
        setPayoutValue(item.sum);
      }
    });
    // eslint-disable-next-line
    earningArray?.map((item) => {
      // eslint-disable-nexxt-line
      if (item.month === value) {
        setEarningsValue(item.sum);
      }
    });
  };

  useEffect(() => {
    const {
      // eslint-disable-next-line
      patientStats,
      doctorStats,
      payoutStats,
      consultationStats,
      earningStats,
    } = data;
    setPatients(patientStats);
    setDoctorStats(doctorStats);
    setTotalConsultations(consultationStats);
    setTotalEarning(earningStats?.total);
    setTotalPayouts(payoutStats?.total);
    setEarningsValue(earningStats?.total);

    //eslint-disable-next-line
  }, [data]);

  const {
    totalAccepted,
    totalCancelled,
    totalOngoing,
    totalDeclined,
    totalCompleted,
  } = totalConsultations;
  const total =
    totalAccepted +
    totalCancelled +
    totalOngoing +
    totalDeclined +
    totalCompleted;

  const { totalActive: activeDoctors, totalInactive: inactiveDoctors } =
    doctorStats;
  const { totalActive: activePatients, totalInactive: inactivePatients } =
    patients;
  const totalDoc = activeDoctors + inactiveDoctors;
  const totalPatient = activePatients + inactivePatients;
  const patientPercentage = returnpercent(activePatients, inactivePatients);
  const doctorPercentage = returnpercent(activeDoctors, inactiveDoctors);

  const [amount, setAmount] = useState([
    {
      name: "Total Earnings",
      value: 0,
    },
    {
      name: "Total Payouts",
      value: 0,
    },
  ]);
  useEffect(() => {
    setCardState([
      {
        id: 1,
        name: "Total Doctors",
        percentageValue: doctorPercentage,
        value: totalDoc,
        icon: <DoctorIcon />,
      },
      {
        id: 2,
        name: "Total Patients",
        percentageValue: patientPercentage,
        value: totalPatient,
        icon: <PatientIcon />,
      },
      {
        id: 3,
        name: "Total Subscribers",
        value: activeSub + inActiveSub, // partnersData?.total,
        icon: <PartnerIcon />,
      },
      {
        id: 4,
        name: "Total Consultations",

        value: total,
        icon: <ConsultationIcon />,
      },
    ]);

    setAmount([
      {
        name: "Total Earnings",
        value: formatNumber(totalEarningsValue),
      },
      {
        name: "Total Payouts",
        value: formatNumber(totalPayoutValue),
      },
    ]);
  }, [
    totalPatient,
    totalEarning,
    totalPayouts,
    activeSub,
    inActiveSub,
    totalPayoutValue,
    totalEarningsValue,
    total,
    patientPercentage,
    doctorPercentage,
    // partnersData?.total,
    totalDoc,
  ]);
  const [cardState, setCardState] = useState([
    {
      id: 1,
      name: "Total Doctors",
      percentageValue: 0,
      value: 0,
    },
    {
      id: 2,
      name: "Total Patients",
      percentageValue: 0,
      value: 0,
    },
    {
      id: 4,
      name: "Total Consultations",
      percentageValue: 0,
      value: 0,
    },
    {
      id: 3,
      name: "Total Partners",
      percentageValue: 0,
      value: 0,
    },
  ]);
  const percentageValue = 0.5;
  return (
    <Grid container gap={2} justifyContent="center">
      <Grid item container gap={1.5} flexWrap="nowrap">
        {cardState?.map((item, index) => {
          return (
            <Grid key={`${item.id}-${index}`} item xs={3}>
              <CardItem key={item.id} value={item} />
            </Grid>
          );
        })}
      </Grid>

      <Grid item container gap={2} flexWrap="nowrap">
        <Grid item xs={8.5} sx={{ height: "100%" }}>
          <Card
            width="100%"
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              borderColor: "transparent",
              borderRadius: "15px",
            }}
          >
            <Grid
              item
              container
              justifyContent="space-between"
              flexWrap="nowrap"
              sx={{ mb: 2 }}
            >
              <Grid item>
                <CustomSelect
                  variant="small"
                  value={partnersState}
                  onChange={handleStateChange}
                  options={partnersOptions}
                  name="partners"
                />
              </Grid>
              <Grid item>
                <CustomSelect
                  variant="small"
                  value={options}
                  onChange={handleOptionChange}
                  options={
                    partnersState === "Consultations"
                      ? consultationsOptions
                      : partnersState === "Finance"
                      ? financeOptions
                      : newOptions
                  }
                  name="graph"
                />
              </Grid>
            </Grid>
            <LineChart2
              graphState={state}
              optionsValue={
                partnersState === "Consultations"
                  ? consultationsOptions
                  : partnersState === "Finance"
                  ? financeOptions
                  : newOptions
              }
              type={
                partnersState === "Consultations"
                  ? "consultation"
                  : partnersState === "Finance"
                  ? "finance"
                  : ""
              }
              opt={options}
            />
          </Card>
        </Grid>
        <Grid item xs={3.5} sx={{ height: "100%" }}>
          <Card
            variant="outlined"
            sx={{
              borderColor: "transparent",
              height: "100%",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              pb: 2,
              // gap: "4rem",
            }}
          >
            {/* <Grid container> */}
            <Grid item container alignItems="center" sx={{ p: 2.5, pb: 1 }}>
              <Grid item flex={1}>
                <Typography
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: "500",
                    lineHeight: "25px",
                    letterSpacing: "-0.01em",
                    color: "#010101",
                  }}
                >
                  Financial Stats
                </Typography>
              </Grid>
              <Grid item>
                <CustomSelect
                  variant="small"
                  value={financeState}
                  onChange={handleFinanceStateChange}
                  options={selectOptions}
                  name="partners"
                />
              </Grid>
            </Grid>
            <Divider sx={{ pt: 1 }} />
            <Grid
              item
              alignItems="center"
              justifyContent="center"
              container
              sx={{ m: "auto" }}
            >
              <CircularProgressBar
                height="15rem"
                width="15rem"
                color={theme.palette.common.green}
                trailColor={theme.palette.common.red}
                value={totalEarning}
              />
            </Grid>

            {amount.map((item, index) => {
              const { value, name } = item;
              return (
                <Grid
                  key={index}
                  item
                  container
                  sx={{ p: 2 }}
                  flexWrap="nowrap"
                >
                  <Grid flex={1}>
                    <Grid container alignItems="center" gap={1}>
                      <div
                        className={`${classes.dottedCircle}
                         ${classes.red}`}
                      />
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "1.4rem",
                          lineHeight: "20px",
                          color: "#606060",
                        }}
                      >
                        {name}
                      </Typography>
                      <Grid
                        item
                        sx={{
                          borderRadius: "100px",
                          color:
                            percentageValue < 1
                              ? "#ED3237"
                              : theme.palette.success.main,
                          backgroundColor:
                            percentageValue < 1
                              ? "rgba(237, 50, 55, 0.1)"
                              : "rgba(62, 165, 132, 0.1)",
                          padding: "3px 8px",
                        }}
                      >
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography
                            variant="span"
                            sx={{ fontWeight: 500, fontSize: "1rem" }}
                          >
                            {"0.5"}
                          </Typography>
                          {percentageValue < 1 ? (
                            <ArrowDownwardOutlined
                              sx={{ color: "inherit", fontSize: "1rem" }}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              sx={{ color: "inherit", fontSize: "1rem" }}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item justifySelf="center">
                    <Grid container>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "1.6rem",
                          lineHeight: "20px",
                          color: "#3F3F3F",
                        }}
                      >
                        NGN {value}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

HopsitalDashboardChart.propTypes = {
  data: PropTypes.object,
  refetch: PropTypes.func,
};

export default HopsitalDashboardChart;
