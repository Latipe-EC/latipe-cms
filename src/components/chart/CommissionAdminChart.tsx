import ReactApexChart from 'react-apexcharts';

const CommissionAdminChart = ({ statisticCommission }) => {
	const sortedItems = [...statisticCommission.items].sort((a, b) => a.month - b.month);
	const series = [
		{
			name: 'Shop nhận được',
			data: sortedItems.map(item => item.store_received)
		},
		{
			name: 'Hệ thống nhận được',
			data: sortedItems.map(item => item.system_received)
		}
	];

	const options = {
		xaxis: {
			categories: sortedItems.map(item => `Tháng ${item.month}`)
		},
		plotOptions: {
			bar: {
				horizontal: false,
			},
		},
		yaxis: {
			title: {
				text: 'Số lượng'
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

	};

	return (
		<ReactApexChart options={options} series={series} type="bar" />
	);
}
export default CommissionAdminChart;