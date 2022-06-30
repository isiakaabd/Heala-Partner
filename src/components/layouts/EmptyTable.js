import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

import EnhancedTableHeader from "./EnhancedTableHeader";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { NoData } from ".";

const EmptyCell = (props) => {
  const { headCells, title } = props;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar title={title} />

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHeader
              rowCount={10}
              headCells={headCells}
              hasCheckbox
            />
            <TableBody>
              <TableRow
                style={{
                  height: 53 * 5,
                  width: "100%",
                }}
              >
                <TableCell colSpan={10}>
                  <Grid container justifyContent="center">
                    <NoData />
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

EmptyCell.propTypes = {
  headCells: PropTypes.array,
  paginationLabel: PropTypes.string,
  title: PropTypes.string,
};

export default EmptyCell;
