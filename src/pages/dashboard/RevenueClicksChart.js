import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot }) => {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const weekAxis = [];
  const monthAxis = [];

  const getClicks = async () => {
    const url = `http://127.0.0.1:5000/clicks?split=${slot}`;

    const response = await fetch(url, {
      method: 'GET'
    });
    const jsonData = await response.json();

    var numClicks = jsonData.map((obj) => obj._col1);
    series[0]['data'] = numClicks;
    setSeries(series);

    var dates = jsonData.map((obj) => obj.day.slice(5, 10));
    if (slot == 'week') {
      updateOptions(dates, monthAxis);
    } else {
      updateOptions(weekAxis, dates);
    }
  };

  const getRevenue = async () => {
    const url = `http://127.0.0.1:5000/revenue?split=${slot}`;
    const response = await fetch(url, {
      method: 'GET'
    });
    const jsonData = await response.json();

    var total = 0;
    var numClicks = jsonData.map((obj) => (total += Math.round(obj._col1)));
    series[1]['data'] = numClicks;
    setSeries(series);
    var dates = jsonData.map((obj) => obj.day.slice(5, 10));
    if (slot == 'week') {
      updateOptions(dates, monthAxis);
    } else {
      updateOptions(weekAxis, dates);
    }
  };

  const updateOptions = (weekAxis, monthAxis) => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: slot === 'month' ? monthAxis : weekAxis,
        labels: {
          style: {
            colors: [secondary]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 3 : 7
      },
      yaxis: [
        {
          title: {
            text: 'Revenue ($)'
          },

          labels: {
            style: {
              colors: [secondary]
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Post-Checkout Link Clicks'
          },

          labels: {
            style: {
              colors: [secondary]
            }
          }
        }
      ],

      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  };
  useEffect(() => {
    getClicks();
    getRevenue();
    updateOptions(weekAxis);
  }, [primary, secondary, line, theme, slot]);

  const [series, setSeries] = useState([
    {
      name: 'Clicks Per Day',
      data: []
    },
    {
      name: 'Revenue Over Time',
      data: []
    }
  ]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
