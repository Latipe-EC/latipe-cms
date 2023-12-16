import Chart from 'react-apexcharts';
import {ApexOptions} from 'apexcharts';

const YearChart = ({statisticYear}) => {

  const sortedItems = [...statisticYear.data.items].sort((a, b) => a.month - b.month);

  const series = [{
    name: 'Amount',
    data: sortedItems.map(item => item.amount)
  }];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: sortedItems.map(item => `${item.month}`),
      title: {
        text: 'Tháng'
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return `${value.toLocaleString('vi-VN')}₫`;
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };


  return (
      <div id="chart">
        <Chart options={options} series={series} type="line" height={350}/>
      </div>
  );
}

export default YearChart;