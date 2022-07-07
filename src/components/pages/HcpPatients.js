import React, { useState, useEffect } from "react";
import { Loader } from "components/Utilities";
import {
  Grid,
  TableRow,
  Typography,
  TableCell,
  Button,
  Checkbox,
  Avatar,
} from "@mui/material";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import { NoData, EnhancedTable, EmptyTable } from "components/layouts";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { hcpPatientsHeadCells } from "components/Utilities/tableHeaders";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { isSelected } from "helpers/isSelected";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { Link, useParams } from "react-router-dom";
import { handleSelectedRows } from "helpers/selectedRows";
import { getDoctorPatients } from "components/graphQL/useQuery";
import { useLazyQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    "&.MuiTableCell-root": {
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
    },
  },
}));

const HcpPatients = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });

  const { hcpId } = useParams();

  const { setSelectedRows } = useActions();
  const { selectedRows } = useSelector((state) => state.tables);

  const [fetchDoctorsPatients, { loading, error, data }] = useLazyQuery(
    getDoctorPatients,
    { notifyOnNetworkStatusChange: true }
  );

  useEffect(() => {
    fetchDoctorsPatients({
      variables: { id: hcpId },
    });
  }, [fetchDoctorsPatients, hcpId]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (data) {
      setProfiles(data.getDoctorPatients.data);
      setPageInfo(data.getDoctorPatients.pageInfo);
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <Grid container direction="column" gap={2} flexWrap="nowrap" height="100%">
      <Grid item>
        <Typography variant="h2">Doctor Patients</Typography>
      </Grid>
      {profiles.length > 0 ? (
        <Grid item container direction="column" height="100%">
          <EnhancedTable
            headCells={hcpPatientsHeadCells}
            rows={profiles}
            paginationLabel="List Per Page"
            hasCheckbox={true}
            changeLimit={(e) =>
              changeHospitalTableLimit(fetchDoctorsPatients, {
                first: e,
                id: hcpId,
              })
            }
            dataPageInfo={pageInfo}
            handlePagination={(page) =>
              handleHospitalPageChange(fetchDoctorsPatients, page, pageInfo, {
                id: hcpId,
              })
            }
          >
            {profiles.map((row, index) => {
              const { _id, doctorData, patientData } = row;
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
                    style={{ color: theme.palette.common.grey }}
                  >
                    {doctorData
                      ? doctorData?.dociId?.split("-")[1]
                      : "No Doctor ID"}
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ marginRight: "1rem" }}>
                        <Avatar
                          alt="Remy Sharp"
                          src={row.image}
                          sx={{ width: 24, height: 24 }}
                        />
                      </span>
                      <span style={{ fontSize: "1.25rem" }}>
                        {patientData?.firstName
                          ? `${patientData?.firstName} ${patientData?.lastName}`
                          : "No Patient Name"}
                        {row.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      className={classes.button}
                      component={Link}
                      to={`/hcps/${hcpId}/profile`}
                      endIcon={<ArrowForwardIosIcon />}
                    >
                      View Doctor Profile
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </EnhancedTable>
        </Grid>
      ) : (
        <EmptyTable
          headCells={hcpPatientsHeadCells}
          paginationLabel="List  per page"
        />
      )}
    </Grid>
  );
};

export default HcpPatients;
