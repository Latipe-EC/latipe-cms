import ReactApexChart from 'react-apexcharts';

const LineChartOrder = (items) => {
	const sortedItems = [...items.items].sort((a, b) => a.hour > b.hour ? 1 : -1);
	const series = [{
		name: 'amount',
		data: sortedItems.map(item => Number(item.amount))
	}];

	const options = {
		dataLabels: {
			enabled: false
		},
		xaxis: {
			categories: sortedItems.map(item => item.hour),
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
		tooltip: {
			y: {
				formatter: function (_value, { dataPointIndex }) {
					return `Số lượng đặt hàng: ${sortedItems[dataPointIndex].count}`;
				}
			}
		}
	};

	return (
		<ReactApexChart options={options} series={series} type='line' height={350} />);
};

export default LineChartOrder;