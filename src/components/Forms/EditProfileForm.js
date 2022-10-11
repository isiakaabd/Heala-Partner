import React from "react";
import * as Yup from "yup";
import t from "prop-types";
import { Formik, Form } from "formik";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { CustomButton } from "components/Utilities";
import { FormikControl } from "components/validation";
import { useMutation } from "@apollo/client";
import { updatePartnerProfile } from "components/graphQL/Mutation";
import { useAlert } from "components/hooks";
// import { addEditPlansValidationSchema } from "helpers/validationSchemas";

export const addEditPlansValidationSchema = Yup.object({
  profileId: Yup.string("Enter Description").trim(),
  partnerName: Yup.string("Enter your Name")
    .trim()
    .required("Name is required"),
  phone: Yup.number("Enter your Amount")
    .typeError(" Enter a valid amount")
    .required("Phone number is required"),
  address: Yup.string("Enter Address").trim(),
  logoImageUrl: Yup.string("Enter image url").trim(),
  bankName: Yup.string("Enter bank name").trim(),
  accName: Yup.string("Enter account name").trim(),
  accNumber: Yup.number("Enter your Amount number")
    .typeError(" Enter a valid account number")
    .test(
      "length",
      "Account number should be 10 digits",
      (value) => `${value}`?.length === 10
    ),
});

const EditProfileForm = () => {
  const theme = useTheme();
  const { _id: profileId } = JSON.parse(localStorage.getItem("partnerData"));
  const { getErrorMsg, watchFunction, displayMessage } = useAlert();
  const [changePartnerProfile] = useMutation(updatePartnerProfile);

  const partnerData = JSON.parse(localStorage.getItem("partnerData"));
  const {
    name: partnerName,
    phone,
    logoImageUrl,
    address,
    bankDetails,
  } = partnerData;

  const initialValues = {
    partnerName: partnerName || "",
    phone: phone || "",
    logoImageUrl: logoImageUrl || "",
    address: address || "",
    bankName: bankDetails[0]?.name || "",
    accName: bankDetails[0]?.accName || "",
    accNumber: bankDetails[0]?.accNumber || "",
  };

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  const onSubmit = async (values) => {
    try {
      const res = changePartnerProfile({ variables: { ...values } });
      return watchFunction(
        "Profile information updated successfully.",
        "Couldn't update profile information, try again.",
        res
      )
        .then(({ data }) => {
          return data?.updatePartnerProfile?.partner;
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
      const errMsg = getErrorMsg(error);
      displayMessage("error", errMsg);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit({ profileId, ...values })}
      validationSchema={addEditPlansValidationSchema}
      validateOnChange={true}
      validateOnMount={false}
      validateOnBlur={true}
    >
      {({ isSubmitting }) => {
        return (
          <Form style={{ marginTop: "1rem" }}>
            <Grid item container direction="column" gap={1}>
              <Grid item container rowSpacing={2}>
                <Grid item container>
                  <FormikControl
                    control="input"
                    name="partnerName"
                    label="Name"
                    placeholder="Enter Partner Name"
                  />
                </Grid>

                <Grid item container>
                  <FormikControl
                    control="input"
                    name="phone"
                    label="Phone number"
                    placeholder="Enter Partner official phone number"
                  />
                </Grid>

                <Grid item container>
                  <FormikControl
                    control="input"
                    placeholder="Enter address"
                    name="address"
                    label="Address"
                  />
                </Grid>

                <Grid item container>
                  <FormikControl
                    control="input"
                    name="bankName"
                    label="Bank name"
                    placeholder="Enter Bank Name"
                  />
                </Grid>

                <Grid item container>
                  <FormikControl
                    control="input"
                    name="accName"
                    label="Account name"
                    placeholder="Enter Account name"
                  />
                </Grid>

                <Grid item container>
                  <FormikControl
                    control="input"
                    name="accNumber"
                    label="Account number"
                    placeholder="Enter account number"
                  />
                </Grid>

                <Grid item container>
                  <FormikControl
                    control="file"
                    name="logoImageUrl"
                    label="Upload logo"
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomButton
                    title="Save"
                    width="100%"
                    type={buttonType}
                    isSubmitting={isSubmitting}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

EditProfileForm.propTypes = {
  onSuccess: t.func.isRequired,
  initialValues: t.object.isRequired,
  type: t.string.isRequired,
};

export default EditProfileForm;

/* 
  {
  id: String
  name: String
  email: String
  category: String
  logoImageUrl: String
  providerId: String
  phone: String
  address: String
  bankDetails: [BankDetailsInput]
  classification: String
  specialisation: String
  }
*/
