import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function createData(dict) {
  return { numClicks: `${dict['count']}`, productName: dict['product'], brandTags: dict['brandTags'], revenue: Math.round(dict['_col3']) };
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'numClicks',
    align: 'left',
    disablePadding: false,
    label: 'Number of Clicks'
  },
  {
    id: 'productName',
    align: 'left',
    disablePadding: true,
    label: 'Product'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| PRODUCT TABLE ||============================== //

export default function ProductsTable({ sortBy }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const [rows, setRows] = useState([]);

  const getBrandInfo = async () => {
    const url = `http://127.0.0.1:5000/product?sortBy=${sortBy}`;

    const response = await fetch(url, {
      method: 'GET'
    });
    const jsonData = await response.json();
    var brandInfo = jsonData.map((obj) => createData(obj));
    setRows(brandInfo);
  };

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  useEffect(() => {
    getBrandInfo();
  }, [sortBy]);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {rows.map((row, index) => {
              const isItemSelected = isSelected(row.numClicks);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.numClicks}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.numClicks}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.productName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
