import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { calculateBMI } from "components/Utilities/bMI";
import { getProfile, findAllergies } from "components/graphQL/useQuery";
import { Loader, ProfileCard } from "components/Utilities";
import { NoData } from "components/layouts";
const MedicalRecords = () => {
  const { patientId } = useParams();
  const [patientProfile, setPatientProfile] = useState([]);

  const { loading, data, error } = useQuery(getProfile, {
    variables: { profileId: patientId },
  });

  const [alergy, allergyResult] = useLazyQuery(findAllergies, {
    variables: { id: patientId },
  });

  const [alergies, setAlergies] = useState([]);
  const [lab] = useState([]); //setLab
  useEffect(() => {
    (async () => {
      try {
        // patients()
        alergy();
        // labResult()
        setAlergies(allergyResult.data.findAllergies.allergies);
        // setLab(labResults.data.getLabResults.lab)
      } catch (err) {
        console.error(err);
      }
    })(); //labResult labResults.data
  }, [alergy, patientId, allergyResult.data]);

  useEffect(() => {
    if (data) {
      setPatientProfile(data.profile);
    }
  }, [data]);

  if (loading || allergyResult.loading) return <Loader />;
  if (error || allergyResult.error)
    return <NoData error={allergyResult.error || error} />;
  // const { height, weight } = data&& patientProfile
  if (patientProfile) {
    const value =
      alergies.length > 0 &&
      alergies?.map((alergy) => alergy.name).filter((i) => i !== undefined);

    const labResult = lab?.map((alergy) => alergy);
    return (
      <Grid
        container
        direction="column"
        gap={{
          md: 5,
          sm: 4,
          xs: 3,
        }}
        paddingBottom={{ md: 10, sm: 5, xs: 3 }}
      >
        <Grid item>
          <Typography variant="h2">Medical Records</Typography>
        </Grid>
        <Grid item container spacing={4} justifyContent="space-between">
          <Grid item container md={6} sm={6} xs={12}>
            <ProfileCard
              text="Height"
              value={
                patientProfile.height ? patientProfile.height : "No Height"
              }
            />
          </Grid>
          <Grid item container md={6} sm={6} xs={12}>
            <ProfileCard
              text="Weight"
              value={
                patientProfile.weight ? patientProfile.weight : "No Weight"
              }
            />
          </Grid>
          <Grid item container md={6} sm={6} xs={12}>
            <ProfileCard
              text="Blood Group"
              value={
                patientProfile.bloodGroup
                  ? patientProfile.bloodGroup
                  : "No Blood Group"
              }
            />
          </Grid>
          <Grid item container md={6} sm={6} xs={12}>
            <ProfileCard
              text="GenoType"
              value={
                patientProfile.genotype
                  ? patientProfile.genotype
                  : "No Genotype"
              }
            />
          </Grid>
          <Grid item container md={6} sm={6} xs={12}>
            <ProfileCard
              text="BMI"
              value={
                patientProfile.height
                  ? calculateBMI(
                      patientProfile.height,
                      patientProfile.weight
                    ).toFixed(2)
                  : "No Value"
              }
            />
          </Grid>
          <Grid item container md={6} sm={6} xs={12}>
            <ProfileCard
              text="Allergies"
              value={value.length > 0 ? value : "No Allergy"}
            />
          </Grid>
          <Grid item container md={6} sm={6} xs={12}>
            <ProfileCard
              text="Lab Results"
              value={value.length > 0 ? labResult : "No Lab Result"}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  } else return <NoData />;
};

export default MedicalRecords;
