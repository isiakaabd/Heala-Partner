import React, { useState, useEffect } from "react";
import NoData from "components/layouts/NoData";
import { Link } from "react-router-dom";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Loader from "components/Utilities/Loader";
import { makeStyles } from "@mui/styles";
import { dateMoment, timeMoment } from "components/Utilities/Time";
import Search from "components/Utilities/Search";
import CustomButton from "components/Utilities/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { EnhancedTable, EmptyTable } from "components/layouts";
import { messagesHeadCells3 } from "components/Utilities/tableHeaders";
import { Button, Checkbox, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import { useQuery } from "@apollo/client";
import { getMessage } from "components/graphQL/useQuery";

const useStyles = makeStyles((theme) => ({
  searchGrid: {
    "&.MuiGrid-root": {
      flex: 1,
      marginRight: "5rem",
    },
  },
  actionBtnGrid: {
    "&.MuiGrid-root": {
      marginRight: "1.5rem",
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
      padding: "0.5rem",
      maxWidth: "10rem",
      fontSize: ".85rem",

      "&:hover": {
        background: "#fcfcfc",
      },

      "&:active": {
        background: "#fafafa",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "0.85rem",
      },

      "& .MuiButton-endIcon": {
        marginLeft: ".2rem",
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
  tableBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      height: "3rem",
      fontSize: "1.25rem",
      borderRadius: "2rem",
      boxShadow: "none",

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
}));

const Messages = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [pageInfo, setPageInfo] = useState([]);
  const greenButtonType = {
    background: theme.palette.primary.main,
    hover: theme.palette.primary.light,
    active: theme.palette.primary.dark,
  };

  const [searchMessage, setSearchMessage] = useState("");
  const [message, setMessage] = useState([]);
  const { loading, data, error, refetch } = useQuery(getMessage, {
    variables: {
      providerId: localStorage.getItem("partnerProviderId"),
    },
    notifyOnNetworkStatusChange: true,
  });
  const onChange = async (e) => {
    setSearchMessage(e);
    if (e === "") {
      refetch();
    } else refetch({ recipient: e });
  };

  useEffect(() => {
    if (data) {
      setMessage(data.getMessages.messages);
      setPageInfo(data.getMessages.pageInfo);
    }
  }, [message, data]);
  const fetchMoreFunc = (e, newPage) => {
    refetch({ page: newPage });
  };

  const { selectedRows } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();
  const { page, totalPages, hasNextPage, hasPrevPage, limit, totalDocs } =
    pageInfo;
  const [rowsPerPage, setRowsPerPage] = useState(0);
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  else {
    return (
      <Grid containerdirection="column" gap={2} flexWrap="nowrap" height="100%">
        <Grid item container style={{ paddingBottom: "5rem" }}>
          <Grid item className={classes.searchGrid}>
            <Search
              value={searchMessage}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type to search Messages by recipient e.g 61e5d7ebbe7d97001467f6fe"
              height="5rem"
            />
          </Grid>
          <Grid item>
            <CustomButton
              endIcon={<AddIcon />}
              title="New Message"
              type={greenButtonType}
              component={Link}
              to="/messages/create-message"
            />
          </Grid>
        </Grid>
        {message.length > 0 ? (
          <Grid item container height="100%" direction="column">
            <EnhancedTable
              headCells={messagesHeadCells3}
              rows={message}
              page={page}
              paginationLabel="Message per page"
              limit={limit}
              totalPages={totalPages}
              totalDocs={totalDocs}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              handleChangePage={fetchMoreFunc}
              hasCheckbox={true}
            >
              {message
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const { recipient, subject, createdAt, _id } = row;
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
                            handleSelectedRows(
                              _id,
                              selectedRows,
                              setSelectedRows
                            )
                          }
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="left"
                        className={classes.tableCell}
                        style={{ maxWidth: "20rem" }}
                      >
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <span style={{ fontSize: "1.25rem" }}>
                            {recipient}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        align="left"
                        className={classes.tableCell}
                        style={{ maxWidth: "15rem" }}
                      >
                        {subject}
                      </TableCell>
                      <TableCell
                        align="left"
                        className={classes.tableCell}
                        style={{ color: theme.palette.common.grey }}
                      >
                        {dateMoment(createdAt)}
                      </TableCell>
                      <TableCell
                        align="left"
                        className={classes.tableCell}
                        style={{ color: theme.palette.common.grey }}
                      >
                        {timeMoment(createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          className={classes.button}
                          component={Link}
                          to={`messages/${_id}`}
                          endIcon={<ArrowForwardIosIcon />}
                        >
                          View Message
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={messagesHeadCells3}
            paginationLabel="Medications  per page"
          />
        )}
      </Grid>
    );
  }
};

export default Messages;
