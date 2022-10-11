import React, { useState } from "react";
import { Loader } from "components/Utilities";
import TableLayout from "components/layouts/TableLayout";
import { useMutation, NetworkStatus } from "@apollo/client";
import { Grid } from "@mui/material";
import { EmptyTable, EnhancedTable } from "components/layouts";
import {
  changeHospitalTableLimit,
  handleHmoPageChange,
} from "helpers/filterHelperFunctions";
import { hmoEnrollesTableHeadCells } from "components/Utilities/tableHeaders";
import { useAlert } from "components/hooks";
import {
  defaultPageInfo,
  /*   hmoSearchFilterOptions,
  hmoSearchOptions, */
} from "helpers/mockData";
import HmoEnrolleesRow from "components/rows/HmoEnrolleesRow";
import EnrolleeProfileModal from "components/modals/EnrolleeProfileModal";
import { getEnrolles } from "components/graphQL/useQuery";
import { deleteEnrollee } from "components/graphQL/Mutation";
import ConfirmDeleteOrDisable from "components/modals/ConfirmDeleteOrDisable";
import AddEditHMOEnrolleeModal from "components/modals/AddEditHMOEnrolleeModal";
import HmoEnrolleeFilters from "components/Forms/Filters/HmoEnrolleeFilters";
/* import { getDynamicSearchPlaceholder } from "helpers/func";
import HmoCompoundSearch from "components/Utilities/HmoCompoundSearch"; */

const HmoEnrolleesTable = ({ enrolleesParams, showHeader }) => {
  const { displayAlert, getErrorMsg } = useAlert();
  const [editData, setEditData] = useState(null);
  const [isDeleting, setIsDeleting] = useState({});
  const [profileDetails, setProfileDetails] = useState({});
  const providerId = localStorage.getItem("partnerProviderId");
  const [editEnrolleeModal, setEditEnrolleeModal] = useState(false);
  const [profileDetailModal, setProfileDetailModal] = useState(false);
  const [enrolleeToDelete, setEnrolleeToDelete] = React.useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = React.useState(false);
  const [deleteHMOEnrollee] = useMutation(deleteEnrollee, {
    refetchQueries: [{ query: getEnrolles }],
  });
  const {
    hmoEnrollees,
    pageInfo,
    fetchEnrollees,
    loading,
    networkStatus,
    setHmoEnrollees,
    setPageInfo,
    refetch,
    variables,
    /* 
        error,
        
        , */
  } = enrolleesParams;

  React.useEffect(() => {
    (hmoEnrollees || []).map((enrollee) => {
      const newIsDeleting = isDeleting;
      setIsDeleting({ [enrollee?._id]: false, ...newIsDeleting });
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hmoEnrollees]);

  const refreshData = () => {
    refetch({
      variables: {
        providerId: providerId,
        first: 10,
      },
    })
      .then(({ data }) => {
        setHmoEnrollees(data?.getEnrollees?.data || []);
        setPageInfo(data?.getEnrollees?.pageInfo || {});
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };

  const setTableData = async (response, errMsg) => {
    response
      .then(({ data }) => {
        setHmoEnrollees(data?.getEnrollees?.data || []);
        setPageInfo(data?.getEnrollees?.pageInfo || defaultPageInfo);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        displayAlert("error", errMsg);
      });
  };

  return (
    <Grid>
      <TableLayout
        showHeader={showHeader}
        header="Enrollees"
        filters={
          <HmoEnrolleeFilters
            setHmoEnrollees={setHmoEnrollees}
            setPageInfo={setPageInfo}
            queryParams={{ variables, fetchEnrollees, refetch }}
          />
        }
      >
        {loading ? (
          <Loader />
        ) : networkStatus === NetworkStatus.refetch ? (
          <Loader />
        ) : hmoEnrollees.length > 0 ? (
          /* ================= HMO TABLE ================= */
          <Grid
            container
            item
            direction="column"
            overflow="hidden"
            maxWidth={{ md: "100%", sm: "100%", xs: "100%" }}
          >
            <EnhancedTable
              headCells={hmoEnrollesTableHeadCells}
              rows={hmoEnrollees}
              paginationLabel="Enrollees per page"
              hasCheckbox={false}
              dataPageInfo={pageInfo}
              changeLimit={async (e) => {
                const res = changeHospitalTableLimit(fetchEnrollees, {
                  first: e,
                });
                await setTableData(res, "Failed to change table limit.");
              }}
              handlePagination={async (page) => {
                const res = handleHmoPageChange(
                  fetchEnrollees,
                  page,
                  pageInfo,
                  {}
                );
                await setTableData(res, "Failed to change page.");
              }}
            >
              {hmoEnrollees.map((row, index) => {
                const { _id } = row;
                return (
                  <HmoEnrolleesRow
                    key={index}
                    index={index}
                    rowData={row}
                    setEditData={setEditData}
                    isDeleting={isDeleting[_id]}
                    setEnrolleeIdToDelete={() => setEnrolleeToDelete(_id)}
                    openEditModal={() => setEditEnrolleeModal(true)}
                    openConfirmModal={() => setConfirmDeleteModal(true)}
                    openProfileDetailsModal={() => {
                      setProfileDetailModal(true);
                      setProfileDetails(row);
                    }}
                  />
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={hmoEnrollesTableHeadCells}
            paginationLabel="Enrollees per page"
          />
        )}
      </TableLayout>

      {/* ==== PROFILE DETAILS MODAL ===== */}
      <EnrolleeProfileModal
        isOpen={profileDetailModal}
        setIsOpen={setProfileDetailModal}
        profileData={profileDetails}
      />

      {/*  ======= CONFIRM DELETE ======== */}
      <ConfirmDeleteOrDisable
        open={confirmDeleteModal}
        setOpen={setConfirmDeleteModal}
        title="Delete Enrollee"
        btnValue="delete"
        onConfirm={async () => {
          setConfirmDeleteModal(false);
          const newIsDeleting = isDeleting;

          try {
            newIsDeleting[enrolleeToDelete] = true;
            setIsDeleting({ ...newIsDeleting });
            const { data } = await deleteHMOEnrollee({
              variables: {
                id: enrolleeToDelete,
              },
            });

            if (!data) {
              newIsDeleting[enrolleeToDelete] = false;
              setIsDeleting({ ...newIsDeleting });
              throw Error("Couldn't delete enrollee");
            }
            displayAlert("success", "Deleted enrollee successfully.");
            refreshData();
            newIsDeleting[enrolleeToDelete] = false;
            setIsDeleting({ ...newIsDeleting });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            const errMsg = getErrorMsg(error);
            displayAlert("error", errMsg);
            newIsDeleting[enrolleeToDelete] = false;
            setIsDeleting({ ...newIsDeleting });
          }
        }}
        confirmationMsg="Are you sure you want to delete"
        onCancel={() => {
          setConfirmDeleteModal(false);
        }}
      />

      {/* EDIT ENROLLEE MODAL */}
      <AddEditHMOEnrolleeModal
        isOpen={editEnrolleeModal}
        setIsOpen={setEditEnrolleeModal}
        type="edit"
        initialValues={editData}
        refetchData={() => refreshData()}
      />
    </Grid>
  );
};

export default HmoEnrolleesTable;
