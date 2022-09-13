import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { NoData, EmptyTable } from "components/layouts";
import FormikControl from "components/validation/FormikControl";
import { useMutation, useLazyQuery, NetworkStatus } from "@apollo/client";
import { makeStyles } from "@mui/styles";
import {
  Modals,
  Loader,
  CompoundSearch,
  DoctorFilters,
  CustomButton,
} from "components/Utilities";
import AddIcon from "@mui/icons-material/Add";
import TableLayout from "components/layouts/TableLayout";
import { useAlert } from "components/hooks";
import { useTheme } from "@mui/material/styles";
import EnhancedTable from "components/layouts/EnhancedTable";
import { hcpsHeadCells5 } from "components/Utilities/tableHeaders";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import {
  Grid,
  TableRow,
  TableCell,
  Button,
  Checkbox,
  Chip,
} from "@mui/material";
import { createDOctorProfile } from "components/graphQL/Mutation";
import { timeConverter } from "components/Utilities/Time";
import {
  changeHospitalTableLimit,
  getSearchPlaceholder,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import { defaultPageInfo, doctorsSearchOptions } from "helpers/mockData";
import {
  getDoctorsProfile,
  getDoctorsProfileByStatus,
} from "components/graphQL/useQuery";

const useStyles = makeStyles((theme) => ({
  searchGrid: {
    "&.MuiGrid-root": {
      flex: 1,
      marginRight: "5rem",
    },
  },
  filterBtnGrid: {
    "&.MuiGrid-root": {
      marginRight: "3rem",
    },
  },
  button: {
    "&.MuiButton-root": {
      background: "#fff",
      color: theme.palette.common.grey,
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
  badge: {
    "&.MuiChip-root": {
      fontSize: "1.25rem !important",
      height: "2.7rem",
      borderRadius: "1.3rem",
    },
  },

  searchFilterBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      background: theme.palette.common.black,
      width: "100%",
    },
  },
  uploadBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      background: "#f2f2f2",
      boxShadow: "none",
      color: theme.palette.common.black,

      "&:hover": {
        background: "#f2f3f3",
        boxShadow: "none",
      },

      "&:active": {
        boxShadow: "none",
      },
    },
  },
}));

const Hcps = () => {
  const classes = useStyles();
  const { displayMessage } = useAlert();
  const theme = useTheme();
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const cadre = [
    { key: "1", value: "1" },
    { key: "2", value: "2" },
    { key: "3", value: "3" },
    { key: "4", value: "4" },
    { key: "5", value: "5" },
  ];
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };
  const [fetchDoctors, { error, loading, refetch, variables, networkStatus }] =
    useLazyQuery(getDoctorsProfile);
  const [
    fetchDoctorsByStatus,
    {
      loading: byStatusLoading,
      refetch: byStatusRefetch,
      variables: byStatusVariables,
    },
  ] = useLazyQuery(getDoctorsProfileByStatus);

  useEffect(() => {
    try {
      async function fetchData() {
        const { data } = await fetchDoctors({
          variables: {
            first: pageInfo.limit,
            providerId: partnerProviderId,
          },
        });
        if (data) {
          setPageInfo(data.doctorProfiles.pageInfo || []);
          setProfiles(data.doctorProfiles.profile || defaultPageInfo);
        }
        // ...
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTableData = async (response, errMsg) => {
    response
      .then(({ data }) => {
        setPageInfo(data.doctorProfiles.pageInfo || []);
        setProfiles(data.doctorProfiles.profile || defaultPageInfo);
      })
      .catch((error) => {
        console.error(error);
        displayMessage("error", errMsg);
      });
  };

  const [profiles, setProfiles] = useState("");

  const [openHcpFilter, setOpenHcpFilter] = useState(false);
  const [openAddHcp, setOpenAddHcp] = useState(false);

  const initialValues1 = {
    hospital: "",
    specialization: "",
    phone: "",
    cadre: "",
  };

  const validationSchema1 = Yup.object({
    hospital: Yup.string("Enter your hospital"),
    specialization: Yup.string("Enter your specialization"),
    phone: Yup.number("Enter a correct Number").typeError(
      "Enter a current Number"
    ),
    cadre: Yup.string("Enter your Cadre").trim(),
  });
  const onSubmit1 = async (values) => {
    const { specialization } = values;
    await refetch({
      specialization,
    });
    setOpenHcpFilter(false);
  };
  const onSubmit = async (values) => {
    const {
      firstName,
      lastName,
      gender,
      phone,
      email,
      hospital,
      healaId,
      specialization,
      dob,
      cadre,
      image,
    } = values;
    const correctDOB = timeConverter(dob);
    await createDoc({
      variables: {
        dociId: healaId,
        firstName,
        lastName,
        gender,
        phoneNumber: phone,
        email,
        hospital,
        specialization,
        dob: correctDOB,
        cadre,
        image,
        providerId: "61db6f8968b248001aec4fcb",
      },
      refetchQueries: [{ query: getDoctorsProfile }],
    });
    setOpenAddHcp(false);
  };
  const specializations = [
    { key: "diagnostics", value: "diagnostics" },
    { key: "pharmacy", value: "pharmacy" },
  ];

  const gender = [
    { key: "Male", value: "Male" },
    { key: "Female", value: "Female" },
  ];

  const initialValues = {
    firstName: "",
    lastName: "",
    specialization: "",
    image: null,
    cadre: "",
    gender: "",
    hospital: "",
    phone: "",
    dob: null,
    healaId: "",
  };
  const validationSchema = Yup.object({
    firstName: Yup.string("Enter your firstName").required(
      "firstName is required"
    ),
    hospital: Yup.string("Enter your hosptial").required(
      "hospital is required"
    ),
    dob: Yup.date("required")
      .typeError(" Enter a valid DOB")
      .required(" DOB required"),
    healaId: Yup.string("Enter healaId").required("HealaID required"),
    gender: Yup.string("select your Gender").required("Select a gender"),
    phone: Yup.number("Enter your Phone Number")
      .typeError(" Enter a valid phone number")
      .min(11, "min value is  11 digits")
      .required("Phone number is required"),
    lastName: Yup.string("Enter your lastName").required(
      "LastName is required"
    ),
    image: Yup.string("Upload a single Image")
      .typeError("Pick correct image")
      .required("Image is required"),
    specialization: Yup.string("select your Specialization").required(
      "Specialization is required"
    ),
    cadre: Yup.string("select your Cadre").required("Cadre is required"),
  });
  const [createDoc] = useMutation(createDOctorProfile);

  const { selectedRows } = useSelector((state) => state.tables);

  const { setSelectedRows } = useActions();

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <Grid container direction="column" gap={2} flexWrap="nowrap" height="100%">
      <Grid
        item
        gap={{ md: 4, sm: 4, xs: 2 }}
        flexDirection={{ md: "row", sm: "row", xs: "column" }}
        container
        justifyContent="space-between"
      >
        {/* <Grid item container flex={1} justifyContent="space-between"> */}
        <Grid item sx={{ ml: "auto" }}>
          <CustomButton
            endIcon={<AddIcon />}
            title="Add Doctor"
            type={buttonType}
            onClick={() => setOpenAddHcp(true)}
          />
        </Grid>
      </Grid>
      <TableLayout
        filters={
          <DoctorFilters
            setProfiles={setProfiles}
            setPageInfo={setPageInfo}
            queryParams={{
              doctorsParams: { fetchDoctors, loading, refetch, variables },
              doctorsByStatusParams: {
                byStatusLoading,
                byStatusVariables,
                byStatusRefetch,
                fetchDoctorsByStatus,
              },
            }}
          />
        }
        search={
          <CompoundSearch
            queryParams={{ fetchData: fetchDoctors, variables, loading }}
            setPageInfo={(data) =>
              setPageInfo(data.doctorProfiles.pageInfo || {})
            }
            setProfiles={(data) =>
              setProfiles(data.doctorProfiles.profile || [])
            }
            getSearchPlaceholder={(filterBy) => getSearchPlaceholder(filterBy)}
            filterOptions={doctorsSearchOptions}
          />
        }
      >
        {loading ? (
          <Loader />
        ) : byStatusLoading ? (
          <Loader />
        ) : networkStatus === NetworkStatus.refetch ? (
          <Loader />
        ) : profiles.length > 0 ? (
          <Grid item container height="100%" direction="column">
            <EnhancedTable
              headCells={hcpsHeadCells5}
              rows={profiles}
              paginationLabel="Doctors per page"
              hasCheckbox={true}
              changeLimit={async (e) => {
                const res = await changeHospitalTableLimit(fetchDoctors, {
                  first: e,
                  providerId: partnerProviderId,
                });

                await setTableData(res, "Failed to change table limit");
              }}
              dataPageInfo={pageInfo}
              handlePagination={async (page) => {
                const res = handleHospitalPageChange(
                  fetchDoctors,
                  page,
                  pageInfo,
                  partnerProviderId
                );

                await setTableData(res, "Failed to change page.");
              }}
            >
              {profiles.map((row, index) => {
                const {
                  _id,
                  dociId,
                  firstName,
                  status,
                  specialization,
                  consultations,
                  lastName,
                } = row;
                const isItemSelected = isSelected(_id, selectedRows);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={_id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={() =>
                          handleSelectedRows(_id, selectedRows, setSelectedRows)
                        }
                        color="primary"
                        checked={isItemSelected}
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
                        minWidth: "10rem",
                      }}
                    >
                      {dociId?.split("-")[1]}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "left",
                        }}
                      >
                        <span style={{ fontSize: "1.25rem" }}>
                          {firstName} {lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.grey }}
                    >
                      {specialization}
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
                    <TableCell>
                      <Button
                        variant="contained"
                        className={classes.button}
                        component={Link}
                        to={`hcps/${_id}`}
                        endIcon={<ArrowForwardIosIcon />}
                      >
                        View Doctor
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={hcpsHeadCells5}
            paginationLabel="Doctors  per page"
          />
        )}
      </TableLayout>
      {/* Filter Modal */}
      <Modals
        isOpen={openHcpFilter}
        title="Filter"
        rowSpacing={5}
        handleClose={() => setOpenHcpFilter(false)}
      >
        <Formik
          initialValues={initialValues1}
          onSubmit={onSubmit1}
          validationSchema={validationSchema1}
          validateOnChange={false}
          validateOnMount={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, isValid, dirty }) => {
            return (
              <Form style={{ marginTop: "3rem" }}>
                <Grid item container direction="column" gap={1}>
                  <Grid item container rowSpacing={3}>
                    <Grid item container>
                      <FormikControl
                        control="select"
                        options={specializations}
                        name="specialization"
                        label="Specialization"
                        placeholder="Select Specialization"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item marginTop={3}>
                  <CustomButton
                    title="Apply Filter"
                    width="100%"
                    type={buttonType}
                    isSubmitting={isSubmitting}
                    disabled={!(dirty || isValid)}
                  />
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Modals>
      {/* ADD Doctor MODAL */}
      <Modals
        isOpen={openAddHcp}
        title="Add Doctor"
        rowSpacing={5}
        height="auto"
        handleClose={() => setOpenAddHcp(false)}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnMount={false}
          validateOnBlur={false}
        >
          {({
            isSubmitting,
            dirty,
            isValid,
            setFieldValue,
            errors,
            setValues,
          }) => {
            console.log(errors);
            return (
              <Form style={{ marginTop: "1rem" }}>
                <Grid container direction="column" gap={2}>
                  <Grid item container direction="column" gap={1}>
                    <Grid item container>
                      <Grid container spacing={2}>
                        <Grid item md>
                          <FormikControl
                            control="input"
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter first name"
                          />
                        </Grid>
                        <Grid item md>
                          <FormikControl
                            control="input"
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter last name"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item container direction="column" gap={2}>
                      <Grid item container>
                        <Grid container spacing={2}>
                          <Grid item md>
                            <Grid container direction="column">
                              <FormikControl
                                control="select"
                                options={specializations}
                                name="specialization"
                                label="Specialization"
                                placeholder="Specialization"
                              />
                            </Grid>
                          </Grid>

                          <Grid item md>
                            <FormikControl
                              control="select"
                              label="Gender"
                              id="gender"
                              name="gender"
                              options={gender}
                              placeholder="Gender"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item container direction="column" gap={2}>
                    <Grid item container>
                      <Grid container spacing={2}>
                        <Grid item md>
                          <FormikControl
                            control="input"
                            label="Phone Number"
                            id="phone"
                            name="phone"
                            placeholder="Enter last Phone number"
                          />
                        </Grid>
                        <Grid item md>
                          <Grid container direction="column">
                            <FormikControl
                              control="select"
                              options={cadre}
                              name="cadre"
                              label="Cadre"
                              placeholder="Select Cadre"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item container direction="column" gap={2}>
                      <Grid item container>
                        <Grid container spacing={2}>
                          <Grid item md>
                            <FormikControl
                              control="date"
                              name="dob"
                              label="DOB"
                              type="hospital"
                              setFieldValue={setFieldValue}
                              setValues={setValues}
                            />
                          </Grid>
                          <Grid item md>
                            <FormikControl
                              control="input"
                              label="HealaId"
                              id="heala"
                              name="healaId"
                              placeholder="Enter Heala ID"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item container spacing={2} alignItems="center">
                    <Grid item container md>
                      <FormikControl
                        control="file"
                        name="image"
                        label="Profile Pics"
                        setFieldValue={setFieldValue}
                      />
                    </Grid>
                    <Grid item md>
                      <FormikControl
                        control="input"
                        name="hospital"
                        label="Hospital"
                        placeholder="Enter Hospital"
                      />
                    </Grid>
                    {/* <Grid item md>
                      <FormikControl
                        control="input"
                        label="Heala-ID"
                        id="dociId"
                        name="dociId"
                        placeholder="Enter Heala ID"
                      />
                    </Grid> */}
                  </Grid>
                  <Grid item container>
                    <CustomButton
                      title="Add Doctor"
                      width="100%"
                      type={buttonType}
                      isSubmitting={isSubmitting}
                      disabled={!(dirty || isValid)}
                    />
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Modals>
    </Grid>
  );
};

export default Hcps;
