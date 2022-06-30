import React, { useState, useEffect } from "react";
import { Grid, Checkbox, Button, TableRow, TableCell } from "@mui/material";
import { Loader, Search, CustomButton, Modals } from "components/Utilities";
import { formatNumber } from "components/Utilities/Time";
import { EnhancedTable, NoData, EmptyTable } from "components/layouts";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { subscriptionHeadersss } from "components/Utilities/tableHeaders";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import {
  changeHospitalTableLimit,
  handleError,
  handleHospitalPageChange,
  showSuccessMsg,
} from "helpers/filterHelperFunctions";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import { SubscriptionModal } from "components/modals/SubscriptionModal";
import DeleteOrDisable from "components/modals/DeleteOrDisable";
import { useMutation, useLazyQuery } from "@apollo/client";
import { getPlans } from "components/graphQL/useQuery";
import { DELETE_PLAN } from "components/graphQL/Mutation";

const useStyles = makeStyles((theme) => ({
  searchGrid: {
    "&.MuiGrid-root": {
      flex: 1,
    },
  },

  FormLabel: {
    "&.MuiFormLabel-root": {
      ...theme.typography.FormLabel,
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
      maxWidth: "15rem",

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
  btn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      width: "100%",
    },
  },
  closeIcon: {
    "&.MuiSvgIcon-root": {
      fontSize: "2rem ",
      cursor: "pointer",

      "&:hover": {
        color: theme.palette.common.red,
      },
    },
  },
  tableBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      height: "3rem",
      fontSize: "1.25rem",
      borderRadius: "2rem",
      boxShadow: "none",
      width: "12rem",

      "&:hover": {
        "& .MuiButton-endIcon>*:nth-of-type(1)": {
          color: "#fff",
        },
      },

      "&:active": {
        boxShadow: "none",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "1.5rem",
      },
    },
  },

  redBtn: {
    "&.MuiButton-root": {
      background: theme.palette.common.lightRed,
      color: theme.palette.common.red,

      "&:hover": {
        background: theme.palette.error.light,
        color: "#fff",
      },
    },
  },

  greenBtn: {
    "&.MuiButton-root": {
      background: theme.palette.common.lightGreen,
      color: theme.palette.common.green,

      "&:hover": {
        background: theme.palette.success.light,
        color: "#fff",
      },
    },
  },
  tableCell: {
    "&.MuiTableCell-root": {
      fontSize: "1.25rem",
    },
  },

  badge: {
    "&.MuiChip-root": {
      fontSize: "1.6rem !important",
      height: "3rem",
      borderRadius: "1.3rem",
    },
    modal: {
      background: "red !important",
      "& > * ": {
        padding: "2rem 1rem",
      },
    },
    ".MuiGrid-root": {
      background: "red",
    },
  },
}));

const Subscription = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [deletePlan] = useMutation(DELETE_PLAN);
  const [id, setId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [deleteModal, setdeleteModal] = useState(false);
  const handleDialogOpen = () => setIsOpen(true);
  const handleEditCloseDialog = () => setEdit(false);
  const providerId = localStorage.getItem("partnerProviderId");
  const handleDeleteOpenDialog = (id) => {
    setId(id);
    setdeleteModal(true);
  };
  const handleEditOpenDialog = (id) => {
    setEdit(true);
    setEditId(id);
  };
  const handleDialogClose = async () => {
    setIsOpen(false);
    setEditId(null);
  };
  const onConfirm = async () => {
    try {
      await deletePlan({
        variables: { id },
        refetchQueries: [
          {
            query: getPlans,
            variables: {
              provider: localStorage.getItem("hospitalID"),
            },
          },
        ],
      });
      refetch();
      showSuccessMsg(enqueueSnackbar, "subscription deleted successfully");
    } catch (error) {
      handleError(enqueueSnackbar, error);
      console.error(error.message);
    }
  };

  const { selectedRows } = useSelector((state) => state.tables);

  const { setSelectedRows } = useActions();

  const [searchMail, setSearchMail] = useState("");

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };
  const [plan, setPlan] = useState([]);
  const [fetchSubscriptions, { loading, data, error, refetch }] =
    useLazyQuery(getPlans);

  useEffect(() => {
    fetchSubscriptions({
      variables: {
        provider: providerId,
        first: 10,
      },
    });
  }, [fetchSubscriptions, providerId]);

  const onChange = async (e) => {
    setSearchMail(e);
    if (e === "") {
      refetch();
    } else refetch({ amount: Number(e) });
  };
  useEffect(() => {
    if (data) {
      setPlan(data.getPlans.plan);
      setPageInfo(data.getPlans.pageInfo);
    }
  }, [data]);

  const initialValues = {
    name: "",
    amount: "",
    description: "",
    duration: "",
    provider: "",
  };
  if (loading) return <Loader />;

  if (error) return <NoData error={error} />;

  return (
    <>
      <Grid
        container
        direction="column"
        flexWrap="nowrap"
        gap={2}
        height="100%"
      >
        <Grid
          item
          flexDirection={{ sm: "row", md: "row", xs: "column" }}
          container
          spacing={{ md: 4, sm: 4, xs: 2 }}
        >
          <Grid item flex={2}>
            <Search
              value={searchMail}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type to search plans by Amount..."
              height="5rem"
            />
          </Grid>

          <Grid item>
            <CustomButton
              endIcon={<AddIcon />}
              title="Create"
              type={buttonType}
              onClick={handleDialogOpen}
            />
          </Grid>
        </Grid>
        {/* The Search and Filter ends here */}

        {plan.length > 0 ? (
          <Grid item container height="100%" direction="column">
            <EnhancedTable
              headCells={subscriptionHeadersss}
              rows={plan}
              paginationLabel="subscription per page"
              hasCheckbox={true}
              changeLimit={(e) =>
                changeHospitalTableLimit(fetchSubscriptions, {
                  first: e,
                  provider: providerId,
                })
              }
              dataPageInfo={pageInfo}
              handlePagination={(page) =>
                handleHospitalPageChange(fetchSubscriptions, page, pageInfo, {
                  provider: providerId,
                })
              }
            >
              {plan.map((row, index) => {
                const { _id, amount, description, duration, name } = row;

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
                      style={{ color: theme.palette.common.black }}
                    >
                      {name}
                    </TableCell>
                    <TableCell
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.red }}
                    >
                      {formatNumber(amount)}
                    </TableCell>

                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      style={{
                        color: theme.palette.common.black,
                        maxWidth: "20rem",
                      }}
                    >
                      {description}
                    </TableCell>

                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      style={{
                        color: theme.palette.common.black,
                        maxWidth: "20rem",
                      }}
                    >
                      {duration}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        <Button
                          variant="contained"
                          disableRipple
                          onClick={() => handleEditOpenDialog(_id)}
                          className={`${classes.tableBtn} ${classes.greenBtn}`}
                          endIcon={<EditIcon color="success" />}
                        >
                          Edit plan
                        </Button>
                        <Button
                          variant="contained"
                          disableRipple
                          onClick={() => handleDeleteOpenDialog(_id)}
                          className={`${classes.tableBtn} ${classes.redBtn}`}
                          to="/view"
                          endIcon={<DeleteIcon color="error" />}
                        >
                          Delete plan
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={subscriptionHeadersss}
            paginationLabel="Subscriptions  per page"
          />
        )}
      </Grid>

      {/* // modal */}
      <Modals
        isOpen={isOpen}
        title="Create new plan"
        rowSpacing={5}
        handleClose={handleDialogClose}
      >
        <SubscriptionModal
          handleDialogClose={handleDialogClose}
          type="add"
          initialValues={initialValues}
        />
      </Modals>

      {/* edit Modal */}
      <Modals
        isOpen={edit}
        title="Edit plan"
        rowSpacing={5}
        handleClose={handleEditCloseDialog}
      >
        <SubscriptionModal
          handleDialogClose={handleEditCloseDialog}
          type="edit"
          editId={editId}
          singleData={singleData}
          setSingleData={setSingleData}
        />
      </Modals>

      {/* delete modal */}
      <DeleteOrDisable
        open={deleteModal}
        setOpen={setdeleteModal}
        title="Delete Plan"
        onConfirm={onConfirm}
        confirmationMsg="delete plan"
        btnValue="Delete"
      />
    </>
  );
};

export default Subscription;
