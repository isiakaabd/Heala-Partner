import React, { useEffect, useState } from "react";
import { dateMoment } from "components/Utilities/Time";
import { useHistory } from "react-router-dom";
import { Grid, Typography, TableRow, TableCell } from "@mui/material";
import { FilterList, Loader } from "components/Utilities";
import { EnhancedTable, NoData, EmptyTable } from "components/layouts";
import { consultationsHeadCells4 } from "components/Utilities/tableHeaders";
import { useActions } from "components/hooks/useActions";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { getConsultations } from "components/graphQL/useQuery";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    "&.css-1jilxo7-MuiTableCell-root": {
      fontSize: "1.25rem",
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
      maxWidth: "12rem",

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
      },
    },
  },
}));

const filterOptions = [
  { id: 0, value: "Name" },
  { id: 1, value: "Date" },
  { id: 2, value: "Description" },
];

const Consultations = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const { patientConsultation } = useActions();
  const { patientId } = useParams();
  const [fetchConsultations, { loading, data, error }] =
    useLazyQuery(getConsultations);

  useEffect(() => {
    fetchConsultations({
      variables: {
        id: patientId,
        orderBy: "-createdAt",
      },
    });
  }, [fetchConsultations, patientId]);

  const [consultations, setConsultations] = useState([]);
  useEffect(() => {
    if (data) {
      setConsultations(data?.getConsultations?.data);
      setPageInfo(data?.getConsultations?.pageInfo);
    }
  }, [data, consultations, patientConsultation]);

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <Grid container gap={2} flexWrap="nowrap" direction="column" height="100%">
      <Grid
        item
        container
        flexWrap="nowrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item flex={1}>
          <Typography variant="h2">Consultations</Typography>
        </Grid>
        <Grid item>
          <FilterList options={filterOptions} title="Filter" />
        </Grid>
      </Grid>
      {consultations.length > 0 ? (
        <Grid item container direction="column" height="100%">
          <EnhancedTable
            headCells={consultationsHeadCells4}
            rows={consultations}
            paginationLabel="Patients per page"
            hasCheckbox={true}
            changeLimit={(e) =>
              changeHospitalTableLimit(fetchConsultations, {
                first: e,
                id: patientId,
                orderBy: "-createdAt",
              })
            }
            dataPageInfo={pageInfo}
            handlePagination={(page) =>
              handleHospitalPageChange(fetchConsultations, page, pageInfo, {
                id: patientId,
                orderBy: "-createdAt",
              })
            }
          >
            {consultations.map((row, index) => {
              const {
                doctorData,
                createdAt,
                symptoms,
                _id,
                contactMedium,
                type,
                status,
              } = row;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={_id}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    history.push(
                      `/patients/${patientId}/consultations/case-note/${_id}`
                    )
                  }
                >
                  <TableCell align="left" className={classes.tableCell}>
                    {dateMoment(createdAt)}
                  </TableCell>
                  <TableCell
                    align="left"
                    className={classes.tableCell}
                    style={{ maxWidth: "25rem" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>
                        {doctorData.firstName
                          ? `${doctorData.firstName} ${doctorData.lastName}`
                          : "No Doctor"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                    <Grid container gap={1}>
                      {symptoms
                        ? symptoms.map((i) => {
                            return <p key={i.name}>{i.name}</p>;
                          })
                        : "No Value"}
                    </Grid>
                  </TableCell>
                  <TableCell
                    align="left"
                    className={classes.tableCell}
                    style={{
                      color: theme.palette.common.grey,
                      minWidth: "6rem",
                    }}
                  >
                    {contactMedium ? contactMedium : "No Value"}
                  </TableCell>
                  <TableCell
                    align="left"
                    className={classes.tableCell}
                    style={{
                      color: theme.palette.common.grey,
                    }}
                  >
                    {type ? type : "No Value"}
                  </TableCell>
                  <TableCell
                    align="left"
                    className={classes.tableCell}
                    style={{
                      color: theme.palette.common.grey,
                    }}
                  >
                    {status ? status : "No Value"}
                  </TableCell>
                </TableRow>
              );
            })}
          </EnhancedTable>
        </Grid>
      ) : (
        <EmptyTable
          headCells={consultationsHeadCells4}
          paginationLabel="Patients per page"
        />
      )}
    </Grid>
  );
};

export default Consultations;
