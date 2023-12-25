import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const CommissionChart = ({ statisticCommission }) => {

	const sortedItems = [...statisticCommission.data.items].sort((a, b) => a.month - b.month);


	const series = [
		{
			name: 'Total Received',
			data: sortedItems.map(item => item.total_received)
		},
		{
			name: 'Total Fee',
			data: sortedItems.map(item => item.total_fee),
		},
		{
			name: 'Total orders',
			data: sortedItems.map(item => item.total_orders)
		}
	];

	const options: ApexOptions = {
		chart: {
			height: 350,
			type: 'bar',
			events: {
				dataPointSelection: ({ config }) => {
					alert(`Total Orders: ${sortedItems[config.dataPointIndex].total_orders}`);
				}
			}
		}
		,
		colors: ['#1f77b4', '#ff7f0e', '#A020F0'],
		dataLabels: {
			enabled: true,
			enabledOnSeries: [0, 1]
		},
		markers: {
			size: 0,
			discrete: [{
				seriesIndex: 2,
				size: 0
			}]
		},

		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
			},
		},

		stroke: {
			show: true,
			width: 2,
			colors: ['transparent']
		},
		xaxis: {
			categories: sortedItems.map(item => `${item.month}`),
			title: {
				text: 'Tháng'
			}
		},
		yaxis: {
			title: {
				text: 'Amount'
			},
			labels: {
				formatter: function (value) {
					return `${value.toLocaleString('vi-VN')}₫`;
				}
			}
		},
		fill: {
			opacity: 1
		},
		tooltip: {
			y: {
				formatter: function (val, opts) {
					const seriesName = opts.w.config.series[opts.seriesIndex].name;

					if (seriesName === 'Total orders') {
						return val.toString();
					} else {
						return `${val.toLocaleString('vi-VN')}₫`;
					}
				}
			}
		}
	};


	return (
		<div id="chart">
			<Chart options={options} series={series} type="line" height={350} />
		</div>
	);
}

export default CommissionChart;