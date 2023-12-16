import ReactApexChart from 'react-apexcharts';


type MiniCartProps = {
  data: {
    product_name: string;
    total: number;
    product_id: string;
  }[];
};


const PieChartListProduct = ({data}: MiniCartProps) => {
  const series = data.map(item => item.total);
  const labels = data.map(item => item.product_name);

  const options = {
    labels: labels,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    chart: {
      width: '50px'
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    hover: {mode: null},
    tooltip: {
      enabled: true,
      theme: 'dark'
    }
  };

  return (
      <ReactApexChart options={options} series={series} type="pie" width='100%'
                      height='55%'/>
  );
};

export default PieChartListProduct;