import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


function Chart({data, label, color}: {data: number[], label: string, color: string}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: label,
      },
    },
  };

  const labels = [...Array(10 + data.length).keys()]; // why :(

  const chartData = {
  labels,
  datasets: [
      {
        label: label,
        data: data,
        borderColor: color == 'red' ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
        backgroundColor: color == 'red' ?  'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="chartWrapper">
    <Line options={options} data={chartData} />
    </div>
  );
}

export default Chart;