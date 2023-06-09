import { useState, useEffect } from 'react';

import { Box, Button, Grid, MenuItem, Stack, Typography, InputLabel, FormControl, Select, SelectChangeEvent } from '@mui/material';

import OrdersTable from './OrdersTable';
import ProductsTable from './ProductsTable';
import RevenueClicksChart from './RevenueClicksChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

const DashboardDefault = () => {
  const [slot, setSlot] = useState('week');
  const [revenue, setRevenue] = useState(null);
  const [clicks, setClicks] = useState(null);

  const getRevenue = async () => {
    const url = `http://127.0.0.1:5000/revenue`;
    const response = await fetch(url, {
      method: 'GET'
    });
    const jsonData = await response.json();
    setRevenue(Math.round(jsonData[0]['total_sum']));
  };

  const getClicks = async () => {
    const url = `http://127.0.0.1:5000/clicks`;
    const response = await fetch(url, {
      method: 'GET'
    });
    const jsonData = await response.json();
    setClicks(jsonData[0]['total_sum']);
  };

  useEffect(() => {
    getRevenue();
    getClicks();
  }, []);

  const [brandSortBy, setBrandSortBy] = useState('');
  const [prodSortBy, setProdSortBy] = useState('');

  const handleBrandChange = (event: SelectChangeEvent) => {
    setBrandSortBy(event.target.value);
  };

  const handleProdChange = (event: SelectChangeEvent) => {
    setProdSortBy(event.target.value);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={6}>
        <AnalyticEcommerce title="Total Revenue" count={`${revenue}`} />
      </Grid>
      <Grid item xs={6}>
        <AnalyticEcommerce title="Total Post-Checkout Link Clicks" count={`${clicks}`} />
      </Grid>

      {/* row 2 */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={6}>
            <Typography variant="h5">FarSight Statistics</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <RevenueClicksChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={6}>
        {/* <Grid item xs={12} md={7} lg={8}> */}
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Top Products with Post-Checkout Link Clicks</Typography>
          </Grid>
          <Grid item>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={prodSortBy} onChange={handleProdChange} label="sortBy" size="small">
                <MenuItem value={'low'}>Low</MenuItem>
                <MenuItem value={'high '}>High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ProductsTable sortBy={prodSortBy} />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Top Post-Checkout Purchases by Brand</Typography>
          </Grid>
          <Grid item>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={brandSortBy} onChange={handleBrandChange} label="sortBy" size="small">
                <MenuItem value={'low'}>Low</MenuItem>
                <MenuItem value={'high '}>High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable sortBy={brandSortBy} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
