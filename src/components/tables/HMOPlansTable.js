import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useAlert } from "components/hooks";
import { pickHmoPlans } from "helpers/func";
import { Loader } from "components/Utilities";
import { EmptyTable } from "components/layouts";
import { isSelected } from "helpers/isSelected";
import { useStyles } from "styles/hmoPageStyles";
import MainModal from "components/modals/MainModal";
import { DeleteOrDisable } from "components/modals";
import { getPlans } from "components/graphQL/useQuery";
import { HMOPlanRow } from "components/rows/HMOPlanRow";
import TableLayout from "components/layouts/TableLayout";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { useLazyQuery, useMutation } from "@apollo/client";
import EnhancedTable from "components/layouts/EnhancedTable";
import { addEditDelHMOPlans } from "components/graphQL/Mutation";
import CreateEditHMOPlans from "components/Forms/CreateEditHMOPlans";
import { hmoPlansTableHeader } from "components/Utilities/tableHeaders";
import { defaultPageInfo } from "../../helpers/mockData";

const HMOPlansTable = ({ PlansQuery }) => {
  /* const theme = useTheme(); */
  const classes = useStyles();
  const [id, setId] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [fetchHealaHmoPlans] = useLazyQuery(getPlans);
  const [editPlanData, setEditPlanData] = useState("");
  const [deletePlan] = useMutation(addEditDelHMOPlans);
  const [deleteModal, setdeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = React.useState({});
  const [hmoHealaPlans, setHmoHealaPlans] = useState([]);
  const providerId = localStorage.getItem("partnerProviderId");
  const { watchFunction, getErrorMsg, displayAlert } = useAlert();
  const { data, loading, refetch } = PlansQuery;
  const plans = data?.getProvider?.hmoPlans || [];
  const [pageInfo] = useState(defaultPageInfo);

  const { selectedRows } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();

  useEffect(() => {
    fetchHealaHmoPlans({
      variables: { type: "hmo" },
    })
      .then(({ data }) => {
        setHmoHealaPlans(data?.getPlans?.plan || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fetchHealaHmoPlans, hmoHealaPlans]);

  useEffect(() => {
    (plans || []).map((plan, index) => {
      const newIsDeleting = isDeleting;
      setIsDeleting({ [index]: false, ...newIsDeleting });
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans]);

  // delete plan
  const onConfirmDelPlan = async () => {
    const newIsDeleting = isDeleting;
    const stopDeleting = () => {
      setId(null);
      newIsDeleting[id] = false;
      setIsDeleting({ ...newIsDeleting });
    };
    try {
      newIsDeleting[id] = true;
      setIsDeleting({ ...newIsDeleting });
      const newPlans = pickHmoPlans(
        plans.filter((plan, idx) => id !== idx),
        ["name", "planId"]
      );
      console.log(newPlans);
      const deletePlanRes = deletePlan({
        variables: {
          id: providerId,
          plans: newPlans,
        },
      });

      return watchFunction(
        "Plan deleted succesfully",
        "Couldn't delete plan.",
        deletePlanRes
      ).then(() => {
        refetch();
        stopDeleting();
      });
    } catch (error) {
      stopDeleting();
      console.error(error);
      const errMsg = getErrorMsg(error);
      displayAlert("error", errMsg);
    }
  };

  return (
    <Grid>
      <Grid item flex={1} container direction="column" rowGap={2}>
        <Grid
          item
          container
          spacing={2}
          className={classes.searchFilterContainer}
        >
          <Grid item container flexWrap="wrap" spacing={4}></Grid>
        </Grid>
        <TableLayout>
          {loading ? (
            <Loader />
          ) : plans.length > 0 ? (
            /* ================= HMO TABLE ================= */
            <Grid
              container
              item
              direction="column"
              overflow="hidden"
              maxWidth={{ md: "100%", sm: "100%", xs: "100%" }}
            >
              <EnhancedTable
                headCells={hmoPlansTableHeader}
                rows={plans}
                paginationLabel="subscription per page"
                hasCheckbox={true}
                dataPageInfo={pageInfo}
                hasPagination={false}
              >
                {plans.map((row, index) => {
                  const isItemSelected = isSelected(index, selectedRows);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const { name, planId } = row;
                  const editFormValues = {
                    index,
                    name,
                    planId,
                  };
                  return (
                    <HMOPlanRow
                      key={`${name}-${index}`}
                      plan={row}
                      hmoHealaPlans={hmoHealaPlans}
                      isItemSelected={isItemSelected}
                      handleSelectedRows={handleSelectedRows}
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows}
                      labelId={labelId}
                      handleDeleteOpenDialog={() => {
                        setId(index);
                        setdeleteModal(true);
                      }}
                      handleEditOpenDialog={() => {
                        setEditPlanData(editFormValues);
                        setEditModal(true);
                      }}
                      deleting={isDeleting[index]}
                    />
                  );
                })}
              </EnhancedTable>
            </Grid>
          ) : (
            <EmptyTable
              headCells={hmoPlansTableHeader}
              paginationLabel="Users per page"
            />
          )}
        </TableLayout>
      </Grid>
      <Grid>
        {/* EDIT PLAN MODAL */}
        <MainModal
          isOpen={editModal}
          headerText="Edit plan"
          rowSpacing={5}
          setIsOpen={() => setEditModal(false)}
        >
          <CreateEditHMOPlans
            initialValues={editPlanData}
            type="edit"
            onSuccess={() => {
              setEditModal(false);
              refetch();
            }}
          />
        </MainModal>

        {/* DELETE PLAN MODAL */}
        <DeleteOrDisable
          open={deleteModal}
          setOpen={setdeleteModal}
          title="Delete Plan"
          onConfirm={onConfirmDelPlan}
          confirmationMsg="delete plan"
          btnValue="Delete"
        />
      </Grid>
    </Grid>
  );
};

HMOPlansTable.propTypes = {
  PlansQuery: PropTypes.object.isRequired,
};

export default HMOPlansTable;
