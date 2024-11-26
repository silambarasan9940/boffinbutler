import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

// Define the type for the dataset
type DataItem = {
  month: string;
  seoul: number;
};

// Sample dataset for the BarChart
const dataset: DataItem[] = [
  { month: 'Jan', seoul: 20 },
  { month: 'Feb', seoul: 35 },
  { month: 'Mar', seoul: 50 },
  { month: 'Apr', seoul: 40 },
  { month: 'May', seoul: 30 },
];

// Function to format values on the chart
const valueFormatter = (value: number | null): string => {
  if (value === null) return 'N/A'; // Handle null values
  return `${value} mm`;
};

const chartSetting = {
  yAxis: [
    {
      label: 'rainfall (mm)',
    },
  ],
  series: [{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

export default function TickPlacementBars() {
  const [tickPlacement, setTickPlacement] = React.useState<
    'start' | 'end' | 'middle' | 'extremities'
  >('middle');
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState<
    'middle' | 'tick'
  >('middle');

  return (
    <div style={{ width: '100%' }}>
      <BarChart
        dataset={dataset}
        xAxis={[
          { scaleType: 'band', dataKey: 'month', tickPlacement, tickLabelPlacement },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
