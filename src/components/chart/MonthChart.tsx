import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const MonthChart = ({ statisticMonth }) => {

	const sortedItems = [...statisticMonth.data.items].sort((a, b) => a.day - b.day);


	const series = [{
		name: 'Số lượng',
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
			categories: sortedItems.map(item => `Ngày ${item.day}`),
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
			<Chart options={options} series={series} type="line" height={350} />
		</div>
	);
}

export default MonthChart;