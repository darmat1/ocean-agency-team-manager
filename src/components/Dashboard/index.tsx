import dynamic from 'next/dynamic';

export const DepartmentChart = dynamic(
  () => import('./DepartmentChart').then((mod) => mod.DepartmentChart),
  {
    ssr: false,
    loading: () => <p>Loading chart...</p>,
  }
);

export const TaskStatusChart = dynamic(
  () => import('./TaskStatusChart').then((mod) => mod.TaskStatusChart),
  {
    ssr: false,
    loading: () => <p>Loading chart...</p>,
  }
);