'use client';

import { Pie } from '@ant-design/plots';

interface DepartmentChartProps {
  data: Array<{ type: string; value: number }>;
}

export const DepartmentChart = ({ data }: DepartmentChartProps) => {
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
        legend: {
      position: 'top',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

    if (!data || data.length === 0) {
    return <div>No department data to display.</div>;
  }

  return <Pie {...config} />;
};