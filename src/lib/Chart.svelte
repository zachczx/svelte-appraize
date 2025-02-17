<script lang="ts">
	import Chart from 'chart.js/auto';
	import ChartDataLabels from 'chartjs-plugin-datalabels';

	let { figures } = $props();
	let chartEl: HTMLCanvasElement;

	const gradeData = {
		labels: ['A', 'B', 'C', 'D'],
		datasets: [
			{
				//https://www.heavy.ai/blog/12-color-palettes-for-telling-better-stories-with-your-data
				data: [figures.percentageA, figures.percentageB, figures.percentageC, figures.percentageD],
				backgroundColor: ['#87bc45', '#27aeef', '#ef9b20', '#ea5545'],
				hoverOffset: 4,
			},
		],
	};

	$effect(() => {
		//Apexcharts
		/* 	const options = {
			chart: {
				type: 'pie',
			},
			series: [figures.percentageA, figures.percentageB, figures.percentageC, figures.percentageD],
			labels: ['A', 'B', 'C', 'D'],
			legend: { show: false },
			colors: ['#FED049', '#808836', '#FF9A00', '#D10363'],
			dataLabels: {
				enabled: true,
				textAnchor: 'middle',
				distributed: false,
				offsetX: 0,
				offsetY: 0,
				formatter: function (val) {
					return val.toFixed(0) + '%';
				},
				style: {
					fontSize: '1.5rem',
					fontFamily: 'Nunito Sans Variable',
					fontWeight: 'bold',
				},
			},
		};
		const chart = new ApexCharts(chartEl, options);
		chart.render(); */
		Chart.register(ChartDataLabels);
		const chart = new Chart(chartEl, {
			type: 'doughnut',
			data: gradeData,
			options: {
				plugins: {
					tooltip: {
						enabled: true,
						callbacks: {
							label: (context) => {
								let label = context.dataset.label || '';
								if (label) {
									label += ': ';
								}
								if (context.parsed) {
									label += ' ' + context.parsed.toString() + '%';
								}
								return label;
							},
						},
					},
					datalabels: {
						display: false,
						font: {
							family: 'Nunito Sans Variable',
							size: 16,
							weight: 700,
						},
						color: '#515151',
						formatter: function (value, context) {
							if (value === 0) {
								return '';
							}
							if (value > 0) {
								return value.toFixed(0) + '%';
							}
						},
					},
					legend: {
						display: false,
					},
				},
			},
		});
	});
</script>

<div class="grid justify-items-center overflow-auto p-2">
	<canvas bind:this={chartEl} class="max-h-36 max-w-36"></canvas>
</div>
