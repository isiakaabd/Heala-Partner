import React, { useState, useEffect } from "react";
import "chartjs-plugin-style";
import PropTypes from "prop-types";
import { HmoCardItem } from "./CardItem";
import { useTheme } from "@mui/material/styles";
import CrownIcon from "components/Icons/CrownIcon";
import { ChevronRight } from "@mui/icons-material";
import WalletIcon from "components/Icons/WalletIcon";
import ConsultIcon from "components/Icons/ConsultIcon";
import {
  hmoConsultationsOptions,
  hmoGraphStateOptions,
} from "helpers/mockData";
import { changeGraphTotal, selectNum, trucateString } from "helpers/func";
import PatientsIcon from "components/Icons/PatientsIcon";
import { CustomSelect } from "components/validation/Select";
import OpenEnvelopeIcon from "components/Icons/OpenEnvelopeIcon";
import { Grid, Card, Typography, Divider, Avatar, Chip } from "@mui/material";
import { returnpercent, newOptions } from "components/Utilities/Time";
import { useLazyQuery } from "@apollo/client";
import { getHmoPlans } from "components/graphQL/useQuery";
import HmoLineChart from "components/Utilities/HmoLineChart";

const HmoDashboardChart = ({ data }) => {
  const theme = useTheme();
  const [hmoPlans, setHmoPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [cardState, setCardState] = useState([]);
  const [graphTotal, setGraphTotal] = useState(0);
  const [enrolleesData, setEnrolleesData] = useState([]);
  const [graphOptions, setGraphOptions] = useState("all");
  const [graphState, setGraphState] = useState("patients");
  const providerId = localStorage.getItem("partnerProviderId");
  const [totalConsultations, setTotalConsultations] = useState("");
  const [fetchHmoPlans] = useLazyQuery(getHmoPlans, {
    notifyOnNetworkStatusChange: true,
    variables: { id: providerId },
  });

  const [patientGraphState] = useState({
    state: "all",
    data: {
      all: data?.patientStats?.chartData || [],
      active: data?.patientStats?.activeChartData || [],
      inactive: data?.patientStats?.inactiveChartData || [],
    },
  });

  const [consultationState] = useState({
    state: "all",
    data: {
      all: data?.consultationStats?.chartData || [],
      completed: data?.consultationStats?.completedChartData || [],
      ongoing: data?.consultationStats?.ongoingChartData || [],
      accepted: data?.consultationStats?.acceptedChartData || [],
      declined: data?.consultationStats?.declinedChartData || [],
      cancelled: data?.consultationStats?.cancelledChartData || [],
    },
  });

  const [enrolleesState] = useState({
    state: "all",
    data: {
      all: data?.enrolleeStats?.chartData || [],
      active: data?.enrolleeStats?.activeChartData || [],
      inactive: data?.enrolleeStats?.inactiveChartData || [],
    },
  });

  const [state, setState] = useState(patientGraphState);

  const handleStateChange = (e) => {
    const { value } = e.target;

    switch (value) {
      case "patients":
        setState(patientGraphState);
        setGraphState("patients");
        setGraphOptions("all");
        const patientsTotal = changeGraphTotal(
          data?.patientStats,
          "patients",
          "all"
        );
        setGraphTotal(patientsTotal || 0);
        break;

      case "consultations":
        setState(consultationState);
        setGraphState("consultations");
        setGraphOptions("all");
        const consultationsTotal = changeGraphTotal(
          data?.consultationStats,
          "consultations",
          "all"
        );
        setGraphTotal(consultationsTotal || 0);
        break;

      case "enrollees":
        setState(enrolleesState);
        setGraphState("enrollees");
        setGraphOptions("all");
        const enrolleesTotal = changeGraphTotal(
          data?.enrolleeStats,
          "enrollees",
          "all"
        );
        setGraphTotal(enrolleesTotal || 0);
        break;

      default:
        setState(patientGraphState);
        setGraphState("Patients");
        setGraphOptions("all");
        const defaultTotal = changeGraphTotal(
          data?.patientStats,
          "patients",
          "all"
        );
        setGraphTotal(defaultTotal || 0);
    }
  };

  const handleOptionChange = (e) => {
    const { value } = e.target;
    setGraphOptions(value);
    const total = changeGraphTotal(data?.patientStats, graphState, value);
    setGraphTotal(total || 0);
  };

  useEffect(() => {
    const {
      // eslint-disable-next-line
      patientStats,
      enrolleeStats,
      consultationStats,
    } = data;
    setPatients(patientStats);
    setEnrolleesData(enrolleeStats);
    setTotalConsultations(consultationStats);
    //eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    fetchHmoPlans()
      .then(({ data }) => {
        setHmoPlans(data?.getProvider?.hmoPlans);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fetchHmoPlans]);

  useEffect(() => {
    const total = changeGraphTotal(data?.patientStats, "patients", "all");
    setGraphTotal(total || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { totalActive, totalInactive } = patients;
  const totalPatient = patients?.total || 0;
  const patientPercentage = returnpercent(totalActive, totalInactive);
  const totalEnrollees = enrolleesData?.total;
  const enrolleesPercentage = returnpercent(
    enrolleesData?.totalActive,
    enrolleesData?.totalInactive
  );
  const sumOfConsultation = totalConsultations?.total;

  useEffect(() => {
    setCardState([
      {
        id: 1,
        name: "Total Patients",
        percentageValue: patientPercentage,
        value: totalPatient,
        icon: <OpenEnvelopeIcon sx={{ fill: "#fff", width: 30, height: 30 }} />,
        iconBgColor: theme.palette.common.blue,
      },
      {
        id: 2,
        name: "Total Enrollees",
        percentageValue: enrolleesPercentage,
        value: totalEnrollees,
        icon: <PatientsIcon sx={{ fill: "#fff", width: 30, height: 30 }} />,
        iconBgColor: "#72CD99",
      },
      {
        id: 3,
        name: "Total Consultations",
        value: sumOfConsultation,
        icon: <ConsultIcon sx={{ fill: "#fff", width: 30, height: 30 }} />,
        iconBgColor: "#F17F58",
      },
      {
        id: 4,
        name: "Total Payout",
        value: 0,
        icon: <WalletIcon sx={{ fill: "#fff", width: 30, height: 30 }} />,
        iconBgColor: "#00B4E3",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPatient, sumOfConsultation, patientPercentage, totalEnrollees]);

  return (
    <Grid container gap={2} justifyContent="center" sx={{ mt: 4 }}>
      <Grid item container gap={1.5} flexWrap="nowrap">
        {cardState?.map((item, index) => {
          return (
            <Grid key={`${item.id}-${index}`} item xs={3}>
              <HmoCardItem
                key={item.id}
                name={item?.name}
                value={item?.value}
                percentageValue={item?.percentageValue}
                icon={item?.icon}
                iconBgColor={item?.iconBgColor}
              />
            </Grid>
          );
        })}
      </Grid>

      <Grid item container gap={2} flexWrap="nowrap">
        <Grid item xs={8} sx={{ height: "100%" }}>
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
                  value={graphState}
                  onChange={handleStateChange}
                  options={hmoGraphStateOptions}
                  name="graphState"
                />
                <Chip
                  label={`Total: ${graphTotal}`}
                  sx={{
                    marginTop: "1rem",
                    backgroundColor: "rgba(62, 165, 132, 0.1)",
                    color: theme.palette.success.main,
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                />
              </Grid>
              <Grid item>
                <CustomSelect
                  variant="small"
                  value={graphOptions}
                  onChange={handleOptionChange}
                  options={
                    graphState === "Consultations"
                      ? hmoConsultationsOptions
                      : newOptions
                  }
                  name="graph"
                />
              </Grid>
            </Grid>
            <HmoLineChart
              graphState={state}
              optionsValue={
                graphState === "Consultations"
                  ? hmoConsultationsOptions
                  : newOptions
              }
              type={graphState === "Consultations" ? "consultation" : ""}
              opt={graphOptions}
            />
          </Card>
        </Grid>
        <Grid item xs={4} sx={{ height: "100%" }}>
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
                  Plan Types
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ pt: 1 }} />

            <Grid>
              {(hmoPlans || []).map((plan, index) => {
                const colors = ["#72CD99", "#F17F58", "#00B4E3", "#3E5EA9"];
                return (
                  <Grid key={`${plan?.name}-${index}`}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ pl: 2.5, pr: 2.5 }}
                    >
                      <Grid item sx={{ margin: "1.5rem 0rem" }}>
                        <Grid container gap={1.5}>
                          <Grid item>
                            <Avatar sx={{ backgroundColor: "#F7F7F7" }}>
                              <CrownIcon
                                sx={{ fill: colors[selectNum(index + 1)] }}
                              />
                            </Avatar>
                          </Grid>
                          <Grid>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: "15px",
                                lineHeight: "19.02px",
                                letterSpacing: "-1%",
                                color: "#010101",
                              }}
                            >
                              {plan?.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 400,
                                fontSize: "12px",
                                lineHeight: "15px",
                                letterSpacing: "-0.005em",
                                color: "#757886",
                              }}
                            >
                              {trucateString(
                                ["Consulation only"].join(", "),
                                30,
                                "front"
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <ChevronRight
                          sx={{ fontSize: "25px", color: "#757886" }}
                        />
                      </Grid>
                    </Grid>
                    <Divider />
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

HmoDashboardChart.propTypes = {
  data: PropTypes.object,
  refetch: PropTypes.func,
};

export default HmoDashboardChart;
