import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const MonthChart = ({ statisticMonth }) => {
	const series = statisticMonth.map((stat, index) => ({
		name: `Statistic ${index + 1}`,
		data: stat.data
	}));

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
			categories: statisticMonth[0].labels,
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