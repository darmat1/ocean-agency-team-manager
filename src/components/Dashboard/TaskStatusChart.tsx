'use client';

import { Column } from '@ant-design/plots';

interface TaskStatusChartProps {
  data: Array<{ status: string; count: number }>;
}

export const TaskStatusChart = ({ data }: TaskStatusChartProps) => {
  const config = {
    data,
    xField: 'status',
    yField: 'count',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      status: { alias: 'Status' },
      count: { alias: 'Number of Tasks' },
    },
  };

  return <Column {...config} />;
};