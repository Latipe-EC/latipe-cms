import ReactApexChart from 'react-apexcharts';


type PieChartDistributionProps = {
	data: {
		platform_fee: number,
		platform_voucher: number,
		total_shipping: number,
		profit: number
	};
};

const PieChartDistribution = ({ data }: PieChartDistributionProps) => {

	console.log(data);
	const series = [data.platform_fee, data.platform_voucher, data.total_shipping, data.profit];
	const labels = ['Phí nền tảng', 'Khuyến mãi', 'Phí ship', 'Lợi nhuận'];

	const options = {
		labels: labels.map(label => label.toString()),
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
			width: 600 // change this to a number
		},
		states: {
			hover: {
				filter: {
					type: 'none'
				}
			}
		},
		legend: {
			show: true, // Show the legend
			position: 'right' as 'top' | 'bottom' | 'left' | 'right'
		},
		hover: { mode: null },
		tooltip: {
			enabled: true,
			theme: 'dark',
			y: {
				formatter: (value) => `${value.toLocaleString('vi-VN')}₫` // Format hover tooltip display to show values in VND
			}
		}
	};

	return (
		<ReactApexChart options={options} series={series} type="pie" width='100%'
			height='100%' />
	);
};

export default PieChartDistribution;