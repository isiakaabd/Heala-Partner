import React, { useEffect, useState } from "react";
import t from "prop-types";
import { Grid } from "@mui/material";
import { Filter } from "components/Utilities";
import { useAlert } from "hooks";
import {
  cadreOptions,
  defaultPageInfo,
  doctorsProfileDefaultFilterByValues,
  genderType,
  specializationOptions,
  // statusFilterBy,
} from "helpers/mockData";
import { deleteVar, filterData } from "helpers/filterHelperFunctions";
import { getProviders } from "components/graphQL/useQuery";
import { useLazyQuery } from "@apollo/client";

const DoctorFilters = ({
  setProfiles,
  setPageInfo,
  queryParams,
  partnerProviderId,
}) => {
  const [displayAlert] = useAlert();
  const [_, setStatusFilterValue] = useState("");
  const [__, setProviders] = useState([]);
  const [profileFilterValues, setProfileFilterValues] = useState(
    doctorsProfileDefaultFilterByValues
  ); // gender cadre specialization providerId
  const [fetchProviders] = useLazyQuery(getProviders, {
    variables: {
      providerId: partnerProviderId,
    },
  });
  const { doctorsParams, doctorsByStatusParams } = queryParams;
  const { fetchDoctors, loading, refetch, variables } = doctorsParams;
  const {
    byStatusLoading,
    // byStatusVaribles,
    // byStatusRefetch,
    // fetchDoctorsByStatus,
  } = doctorsByStatusParams;
  console.log(_, __);
  useEffect(() => {
    fetchProviders()
      .then(({ data }) => {
        if (!data) throw Error("Couldn't get list of providers");
        const providersList = (data?.getProviders?.provider || []).map(
          (provider) => {
            const { _id, name } = provider;
            return { key: name, value: _id };
          }
        );
        setProviders(providersList);
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilterProfileChange = async (name, value) => {
    try {
      setStatusFilterValue("");
      deleteVar(variables);
      const filterValues = { ...profileFilterValues, [name]: value };
      setProfileFilterValues(filterValues);
      filterData(filterValues, {
        fetchData: fetchDoctors,
        refetch,
        variables,
        providerId: localStorage.getItem("partnerProviderId"),
      })
        .then((data) => {
          setPageInfo(data.doctorProfiles.pageInfo || []);
          setProfiles(data.doctorProfiles.profile || defaultPageInfo);
        })
        .catch(() => {
          refresh(setProfileFilterValues, doctorsProfileDefaultFilterByValues);
        });
    } catch (error) {
      console.error(error);
      refresh(setProfileFilterValues, doctorsProfileDefaultFilterByValues);
    }
  };

  // const onFilterStatusChange = async (value) => {
  //   try {
  //     setProfileFilterValues(doctorsProfileDefaultFilterByValues);
  //     deleteVar(byStatusVaribles);
  //     setStatusFilterValue(value);
  //     const filterVariables = { status: value };
  //     filterData(filterVariables, {
  //       fetchData: fetchDoctorsByStatus,
  //       refetch: byStatusRefetch,
  //       variables: byStatusVaribles,
  //     })
  //       .then((data) => {
  //         console.log(data);
  //         setProfiles(data?.doctorProfilesByStatus?.profile || []);
  //         setPageInfo(data?.doctorProfilesByStatus?.pageInfo || {});
  //       })
  //       .catch(() => {
  //         refresh(setStatusFilterValue, "");
  //       });
  //   } catch (error) {
  //     console.error(error);
  //     refresh(setStatusFilterValue, "");
  //   }
  // };

  const refresh = async (setFilterValue, defaultVal) => {
    displayAlert("error", `Something went wrong while filtering. Try again.`);
    setFilterValue(defaultVal);

    deleteVar(variables);

    refetch()
      .then(({ data }) => {
        setProfiles(data?.profiles?.data || []);
        setPageInfo(data?.profiles?.pageInfo || {});
      })
      .catch((error) => {
        console.error(error);
        displayAlert("error", `Failed to get patients data, Try again`);
      });
  };
  return (
    <Grid item container flexWrap="wrap" spacing={4}>
      {/* FILTER BY PROFILE */}
      <Grid item>
        <Grid container flexWrap="wrap" spacing={2} alignItems="flex-end">
          {[
            {
              label: "By Profile",
              onHandleChange: (e) =>
                onFilterProfileChange("gender", e?.target?.value),
              onClickClearBtn: () => onFilterProfileChange("gender", ""),
              options: genderType,
              name: "gender",
              placeholder: "By gender",
              value: profileFilterValues.gender,
              hasClearBtn: true,
              disavle: loading || byStatusLoading,
            },
            {
              label: "",
              onHandleChange: (e) =>
                onFilterProfileChange("cadre", e?.target?.value),
              onClickClearBtn: () => onFilterProfileChange("cadre", ""),
              options: cadreOptions,
              name: "cadre",
              placeholder: "By cadre",
              value: profileFilterValues.cadre,
              hasClearBtn: true,
              disavle: loading || byStatusLoading,
            },
            {
              label: "",
              onHandleChange: (e) =>
                onFilterProfileChange("specialization", e?.target?.value),
              onClickClearBtn: () =>
                onFilterProfileChange("specialization", ""),
              options: specializationOptions,
              name: "specialization",
              placeholder: "By specialization",
              value: profileFilterValues.specialization,
              hasClearBtn: true,
              disavle: loading || byStatusLoading,
            },
          ].map((filter, idx) => {
            return (
              <Grid item key={`${idx}-${filter.name}`}>
                <Filter
                  label={filter.label}
                  onHandleChange={(e) => filter.onHandleChange(e)}
                  onClickClearBtn={() => filter.onClickClearBtn()}
                  options={filter.options}
                  name={filter.name}
                  placeholder={filter.placeholder}
                  value={filter.value}
                  hasClearBtn={true}
                  disable={loading || byStatusLoading}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      {/* FILTER BY STATUS */}
      {/* <Grid item>
        <Filter
          label="By Status"
          onHandleChange={(e) => onFilterStatusChange(e?.target?.value)}
          onClickClearBtn={() => onFilterStatusChange("")}
          options={statusFilterBy}
          name="status"
          placeholder="None"
          value={statusFilterValue}
          hasClearBtn={true}
          disable={loading || byStatusLoading}
        />
      </Grid> */}
    </Grid>
  );
};
DoctorFilters.propTypes = {
  setProfiles: t.func.isRequired,
  setPageInfo: t.func.isRequired,
  queryParams: t.object.isRequired,
};

export default DoctorFilters;