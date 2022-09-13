import React, { useState, useEffect } from "react";
import FormikControl from "components/validation/FormikControl";
import { Formik, Form } from "formik";

import TableLayout from "components/layouts/TableLayout";
import * as Yup from "yup";
import { NoData, EmptyTable } from "components/layouts";
import {
  defaultPageInfo,
  searchOptions,
  patientSearchOptions,
} from "helpers/mockData";
import {
  Button,
  Chip,
  Checkbox,
  TableCell,
  TableRow,
  Grid,
} from "@mui/material";
import {
  Modals,
  Loader,
  CustomButton,
  PatientFilters,
  CompoundSearch,
} from "components/Utilities";
import { EnhancedTable } from "components/layouts";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { patientsHeadCells1 } from "components/Utilities/tableHeaders";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import displayPhoto from "assets/images/avatar.svg";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import { useLazyQuery } from "@apollo/client";
// import { getPatients } from "components/graphaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkvkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo6666666666666666666666666666666666666666666666666666666666666666666666uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuukkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkQL/useQuery";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
  getSearchPlaceholder,
} from "helpers/filterHelperFunctions";
import {
  getPatients,
  getPatientsByPlan,
  getPatientsByStatus,
} from "components/graphQL/useQuery";

const genderType = [
  { key: "Male", value: "0" },
  { key: "Female", value: "1" },
];

const useStyles = makeStyles((theme) => ({
  searchFilterContainer: {
    "&.MuiGrid-root": {
      justifyContent: "space-between",
    },
  },
  button: {
    "&.MuiButton-root": {
      background: "#fff",
      color: "#757886",
      textTransform: "none",
      borderRadius: "2rem",
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      maxWidth: "10rem",
      whiteSpace: "nowrap",

      "&:hover": {
        background: "#fcfcfc",
      },

      "&:active": {
        background: "#fafafa",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "1.2rem",
      },

      "& .MuiButton-endIcon": {
        marginLeft: ".3rem",
        marginTop: "-.2rem",
      },
    },
  },

  tableCell: {
    "&.MuiTableCell-root": {
      fontSize: "1.25rem",
      textAlign: "left",
    },
  },

  badge: {
    "&.MuiChip-root": {
      fontSize: "1.25rem !important",
      height: "2.7rem",

      borderRadius: "1.3rem",
    },
  },
  searchFilterBtn: {
    "&.MuiButton-root": {
      fontSize: "1.5rem",
      textTransform: "none",
      height: "5rem",
      borderRadius: 10,
      boxShadow: "0px 0px 4px -1px rgba(71,64,71,0.63)",
      background: "#2D2F39",
      width: "100%",
    },
  },
}));

const Patients = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [fetchPatient, { loading, refetch, error, variables }] =
    useLazyQuery(getPatients);
  const [
    fetchPatientByStatus,
    {
      loading: byStatusLoading,
      variables: byStatusVaribles,
      refetch: byStatusRefetch,
    },
  ] = useLazyQuery(getPatientsByStatus);
  const [
    fetchPatientByPlan,
    {
      loading: byPlanLoading,
      variables: byPlanVaribles,
      refetch: byPlanRefetch,
    },
  ] = useLazyQuery(getPatientsByPlan);
  const id = localStorage.getItem("partnerProviderId");

  const initialValues = {
    name: "",
    bloodGroup: "",
    phone: "",
    gender: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string("Enter your hospital").trim(),
    bloodGroup: Yup.string("Enter your bloodGroup").trim(),
    gender: Yup.string("Select your gender"),
    phone: Yup.number("Enter your specialization").typeError(
      "Enter a current Number"
    ),
  });
  const setTableData = async (response, errMsg) => {
    response
      .then(({ data }) => {
        setPageInfo(data?.profiles?.pageInfo || []);
        setProfiles(data?.profiles?.data || defaultPageInfo);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPatient({
      variables: {
        first: pageInfo.limit,
      },
    }).then(({ data }) => {
      if (data) {
        setPageInfo(data?.profiles?.pageInfo || []);
        setProfiles(data?.profiles?.data || defaultPageInfo);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPatient({
      variables: {
        first: 10,
        providerId: id,
      },
    });
  }, [fetchPatient, id]);

  const [profiles, setProfiles] = useState([]);
  const onSubmit = async (values) => {
    const { gender } = values;
    await fetchPatient({
      variables: {
        gender,
      },
    });
    handleDialogClose();
  };
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const history = useHistory();
  const { selectedRows } = useSelector((state) => state.tables);

  const { setSelectedRows } = useActions();

  const [isOpen, setIsOpen] = useState(false);
  const handleDialogClose = () => setIsOpen(false);

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
    disabled: theme.palette.common.black,
  };
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <Grid item flex={1} container direction="column" rowGap={2}>
      <Grid
        item
        container
        spacing={2}
        className={classes.searchFilterContainer}
      >
        <Grid item container flexWrap="wrap" spacing={4}></Grid>
      </Grid>
      <TableLayout
        filters={
          <PatientFilters
            setProfiles={setProfiles}
            setPageInfo={setPageInfo}
            queryParams={{
              patientsParams: { fetchPatient, loading, refetch, variables },
              patientsByStatusParams: {
                byStatusLoading,
                byStatusVaribles,
                byStatusRefetch,
                fetchPatientByStatus,
              },
              patientsByPlanParams: {
                byPlanLoading,
                byPlanVaribles,
                byPlanRefetch,
                fetchPatientByPlan,
              },
            }}
          />
        }
        search={
          <CompoundSearch
            queryParams={{
              fetchData: fetchPatient,
              variables,
              loading,
              newVariables: {},
            }}
            setPageInfo={(data) => setPageInfo(data?.profiles?.pageInfo || {})}
            setProfiles={(data) => setProfiles(data?.profiles?.data || [])}
            getSearchPlaceholder={(filterBy) => getSearchPlaceholder(filterBy)}
            filterOptions={searchOptions}
          />
        }
      >
        {loading || byStatusLoading || byPlanLoading ? (
          <Loader />
        ) : // ) : networkStatus === NetworkStatus.refetch ? (
        //   <Loader />
        profiles.length > 0 ? (
          /* ================= PATIENTS TABLE ================= */
          <Grid
            container
            item
            direction="column"
            overflow="hidden"
            maxWidth={{ md: "100%", sm: "100%", xs: "100%" }}
          >
            <EnhancedTable
              headCells={patientsHeadCells1}
              rows={profiles}
              paginationLabel="Patients per page"
              hasCheckbox={true}
              changeLimit={async (e) => {
                const res = changeHospitalTableLimit(fetchPatient, {
                  first: e,
                  providerId: id,
                });
                await setTableData(res, "Failed to change table limit.");
              }}
              dataPageInfo={pageInfo}
              handlePagination={async (page) => {
                const res = handleHospitalPageChange(
                  fetchPatient,
                  page,
                  pageInfo,
                  id
                );
                await setTableData(res, "Failed to change page.");
              }}
            >
              {profiles.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const {
                  dociId,
                  firstName,
                  lastName,
                  plan,
                  provider,
                  //image,
                  consultations,
                  _id,
                  status,
                } = row;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={_id}
                    // selected={isItemSelected}
                    style={{ cursor: "pointer" }}
                    onClick={() => history.push(`patients/${_id}`)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={() =>
                          handleSelectedRows(_id, selectedRows, setSelectedRows)
                        }
                        color="primary"
                        // checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                      style={{
                        color: theme.palette.common.grey,
                        textAlign: "left",
                      }}
                    >
                      {dociId?.split("-")[1]}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          test="test-value"
                          style={{ fontSize: "1.25rem" }}
                        >{`${firstName} ${lastName}`}</span>
                      </div>
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {plan ? plan : "No Plan"}
                    </TableCell>
                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      data-testid="test-value"
                    >
                      {provider ? provider : "No Provider"}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {consultations ? consultations : 0}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      <Chip
                        label={status ? status : "No Status"}
                        className={classes.badge}
                        style={{
                          background:
                            status === "Active"
                              ? theme.palette.common.lightGreen
                              : theme.palette.common.lightRed,
                          color:
                            status === "Active"
                              ? theme.palette.common.green
                              : theme.palette.common.red,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={patientsHeadCells1}
            paginationLabel="Patients per page"
          />
        )}
      </TableLayout>
    </Grid>
  );
};

export default Patients;
