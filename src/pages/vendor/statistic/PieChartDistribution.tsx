import ReactApexChart from 'react-apexcharts';


type PieChartDistributionProps = {
	data: {
		revenue: number,
		store_voucher: number,
		platform_fee: number,
		profit: number
	};
};

const PieChartDistribution = ({ data }: PieChartDistributionProps) => {
	const series = [
		data.revenue,
		data.store_voucher,
		data.platform_fee,
		data.profit
	];
	const labels = ['Doanh thu', 'Khuyến mãi', 'Phí nền tảng', 'Lợi nhuận'];
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
			width: 380 // change this to a number
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
			height='55%' />
	);
};

export default PieChartDistribution;