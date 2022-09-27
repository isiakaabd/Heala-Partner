import React, { useState, useEffect } from "react";
import { ReactComponent as DangerIcon } from "assets/images/Vector.svg";
// import { makeStyles } from "@mui/styles";
import { ReactComponent as SearchIcon } from "assets/images/searchs.svg";
import { ReactComponent as Users } from "assets/images/users.svg";
import { useAlert } from "components/hooks";
import {
  IconButton,
  Grid,
  InputBase,
  Typography,
  Card,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import { CustomButton, Loader } from "components/Utilities";
import { FormikControl } from "components/validation";
import { Formik, Form } from "formik";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  getUserTypes,
  getUserTypeProviders,
} from "components/graphQL/useQuery";
import { validateEnrollee } from "components/graphQL/Mutation";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
//
const Validations = () => {
  const theme = useTheme();
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };
  const [state, setState] = useState([]);
  const [formState, setFormState] = useState();
  console.log(formState);
  const [inputState, setInputState] = useState();
  const validationSchema = Yup.object({
    hmo: Yup.string("Enter your HMO name")
      .trim()
      .required("HMO Name is required"),
    id: Yup.string("Enter your Customer ID")
      .trim()
      .required("Customer ID is required"),
  });
  const validationSchema2 = Yup.object({
    firstName: Yup.string("Enter your First name")
      .trim()
      .required("HMO Name is required"),
    lastName: Yup.string("Enter your First name")
      .trim()
      .required("HMO Name is required"),
    plan: Yup.string("Enter your  HMO plan")
      .trim()
      .required("HMO plan is required"),
    date: Yup.string("Select a date")
      .trim()
      .required("Expiry Date is required"),
  });
  const [
    validate,
    { data: validateData, loading: validateLoading, error: err },
  ] = useMutation(validateEnrollee);
  const { displayMessage } = useAlert();
  const { data, loading: load } = useQuery(getUserTypes);
  const [fetchProvider, { data: dat, loading }] =
    useLazyQuery(getUserTypeProviders);
  const [userTypeId, setUserTypeIds] = useState("");
  const [providers, setProviders] = useState([]);
  const [input, setInput] = useState("");
  const [details, setDetails] = useState("");
  const handleChange = (e) => {
    const { value } = e.target;
    setInputState(value);
    setInput(value.toLowerCase());
  };
  useEffect(() => {
    setUserTypeIds(data?.getUserTypes?.userType[0]._id);
  }, [data]);
  useEffect(() => {
    if (userTypeId) {
      fetchProvider({
        variables: {
          id: userTypeId,
        },
      });
    }
    //eslint-disable-next-line
  }, [userTypeId]);
  useEffect(() => {
    if (dat) {
      setProviders(dat?.getUserTypeProviders?.provider);
    }
  }, [dat]);
  useEffect(() => {
    setDetails(validateData?.validateEnrollee?.data);
  }, [validateData]);

  useEffect(() => {
    const filteredData = providers.filter((el) => {
      //if no input the return the original
      if (input === "") {
        return el;
      }
      //return the item which contains the user input
      else {
        return el.name.toLowerCase().includes(input);
      }
    });
    setState(filteredData);
    //eslint-disable-next-line
  }, [input]);
  const handleSelect = (item) => {
    const { name, userTypeId, userTypeData } = item;

    setFormState({
      hmo: name,
      userTypeId,
    });
    setState([]);
    setInputState(name);
  };
  const onSubmit = async (values) => {
    const { id } = values;
    try {
      await validate({
        variables: {
          hmoId: id,
          providerId: formState.userTypeId,
        },
      });
      displayMessage("success", "Validation Successful");
    } catch (error) {
      displayMessage("error", error);
    }
  };
  if (loading || load) return <Loader />;
  return (
    <Grid container sx={{ pt: 3, px: 6 }} gap={4}>
      <Grid item xs={9} sx={{ margin: "auto", py: 5 }}>
        <Grid
          container
          flexWrap="nowrap"
          alignItems="center"
          gap={4}
          sx={{
            py: 2,
            px: 6,
            color: "#3E5EA9",
            background: "#ECEFF6",
            fontWeight: 300,
            fontSize: "2rem",
            lineHeight: "2.5rem",
            textAlign: "center",
          }}
        >
          <Grid item>
            <DangerIcon sx={{ font: "inherit" }} />
          </Grid>
          <Typography variant="body2" sx={{ font: "inherit" }}>
            Validate the HMO authenticity of customers through their ID, view
            profile and details of their active plans
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={9} sx={{ margin: "auto" }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          flexWrap="nowrap"
          sx={{ height: "6rem" }}
        >
          <Grid
            item
            sx={{
              height: "inherit",
              width: "100%",
              color: "#E6E6E6",
              background: "rgba(230, 230, 230, 0.5)",
              borderRadius: "4rem",
              display: "flex",
              alignItems: "center",
              padding: "1.6rem !important",
              paddingTop: 0,
              fontWeight: 300,
              fontSize: "2.4rem",
              position: "relative",
              letterSpacing: "-0.01em",
            }}
          >
            <IconButton
              type="button"
              aria-label="search"
              sx={{ color: "#6C6C6C", fontSize: "small" }}
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ flex: 1, p: 0, lineHeight: "3rem", font: "inherit" }}
              size="large"
              placeholder="Search by HMO by Name,"
              onChange={handleChange}
              value={inputState}
            />
          </Grid>
        </Grid>
        {state.length > 0 && (
          <Grid item container sx={{ mt: 2 }}>
            <List
              sx={{
                width: "100%",
              }}
            >
              {state?.map((item) => (
                <ListItem
                  key={item.name}
                  sx={{
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    borderBottom: "1px solid #E6E6E6",
                  }}
                  onClick={() => handleSelect(item)}
                >
                  {item.name}
                </ListItem>
              ))}
            </List>
          </Grid>
        )}
      </Grid>
      <Grid item xs={9} sx={{ margin: "auto" }}>
        <Formik
          initialValues={
            formState?.name ? { hmo: "", id: "", userTypeId: "" } : formState
          }
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnMount={false}
          validateOnBlur={false}
          enableReinitialize
        >
          {({ isSubmitting, dirty, isValid }) => {
            return (
              <Form style={{ marginTop: "1rem" }}>
                <Grid
                  container
                  justifyContent="space-between"
                  flexWrap="nowrap"
                >
                  <Grid item xs={4}>
                    <FormikControl
                      control="input"
                      label="HMO Name"
                      id="hmo"
                      name="hmo"
                      placeholder="Enter HMO name"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormikControl
                      control="input"
                      label="HMO ID"
                      id="id"
                      name="id"
                      placeholder="Enter HMO ID"
                    />
                  </Grid>

                  <Grid item xs={2} alignSelf="flex-end">
                    <CustomButton
                      title="Validate"
                      width="100%"
                      borderRadius={12}
                      type={buttonType}
                      isSubmitting={isSubmitting}
                      disabled={!dirty || !isValid || isSubmitting}
                    />
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Grid>
      <Grid item xs={9} sx={{ margin: "auto" }}>
        <Card sx={{ p: 4, borderRadius: 2.5, boxShadow: "none" }}>
          <Grid item container>
            <Grid item container direction="column" gap={0.5}>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: "2.4rem",
                  lineHeight: "3rem",
                  letterSpacing: " -0.01em",
                  color: "#6C6C6C",
                }}
              >
                HMO Details
              </Typography>
              <Divider sx={{ mb: 6 }} />
            </Grid>
            <Grid item container gap={4} flexWrap="nowrap">
              <Grid
                item
                xs={4}
                sx={{ border: "1px solid #E6E6E6", borderRadius: 4 }}
              >
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  {details?.icon ? (
                    <img
                      src={details?.icon}
                      alt={details?.name}
                      style={{
                        width: "12.8rem",
                        height: "12.8rem",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Users />
                  )}
                </Grid>
              </Grid>
              <Grid item xs={8} sx={{ pt: 4 }}>
                <Grid container>
                  <Formik
                    initialValues={
                      details?.name
                        ? {
                            firstName: "",
                            lastName: "",
                            plan: "",
                            expiryDate: "",
                          }
                        : details
                    }
                    onSubmit={onSubmit}
                    validationSchema={validationSchema2}
                    validateOnChange={false}
                    validateOnMount={false}
                    validateOnBlur={false}
                  >
                    {({ isSubmitting, dirty, isValid }) => {
                      return (
                        <Form style={{ marginTop: "1rem" }}>
                          <Grid container direction="column" gap={2}>
                            <Grid item container gap={2} flexWrap="nowrap">
                              <Grid item xs={6}>
                                <FormikControl
                                  control="input"
                                  label="First Name"
                                  id="firstName"
                                  name="firstName"
                                  placeholder="Enter Your First Name"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormikControl
                                  control="input"
                                  label="Last Name"
                                  id="lastName"
                                  name="lastName"
                                  placeholder="Enter Your Last Name"
                                />
                              </Grid>
                            </Grid>
                            <Grid item container gap={2} flexWrap="nowrap">
                              <Grid item xs={6}>
                                <FormikControl
                                  control="input"
                                  label="HMO Plan"
                                  id="hmo plan"
                                  name="plan"
                                  placeholder="HMO PLAN"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormikControl
                                  control="date"
                                  label="Expiry Date"
                                  id="date"
                                  name="expiryDate"
                                  placeholder="Date"
                                />
                              </Grid>
                            </Grid>
                            {/* <Grid item container>
                              <CustomButton
                                title="Add Test"
                                width="100%"
                                type={buttonType}
                                isSubmitting={isSubmitting}
                                disabled={!dirty || !isValid || isSubmitting}
                              />
                            </Grid> */}
                          </Grid>
                        </Form>
                      );
                    }}
                  </Formik>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Validations;
