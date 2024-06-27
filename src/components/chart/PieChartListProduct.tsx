import ReactApexChart from 'react-apexcharts';


type PieChartListProductProps = {
	data: {
		product_name: string;
		total: number;
		product_id: string;
	}[];
};


const PieChartListProduct = ({ data }: PieChartListProductProps) => {
	const series = data.map(item => item.total);
	const labels = data.map(item => {
		const words = item.product_name.split(' ');
		if (words.length > 10) {
			return words.slice(0, 10).join(' ') + '...';
		} else {
			return item.product_name;
		}
	});

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
			width: 600
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
			theme: 'dark'
		}
	};

	return (
		<ReactApexChart options={options} series={series} type="pie" width='100%'
			height='100%' />
	);
};

export default PieChartListProduct;