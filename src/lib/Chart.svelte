<script lang="ts">
	import { onMount } from 'svelte';
	import ApexCharts from 'apexcharts?client';

	// interface ChartOptions {
	// 	options: {
	// 		chart: {
	// 			type: string;
	// 		};
	// 		series: number[];
	// 		chartOptions: {
	// 			labels: string[];
	// 		};
	// 		plotOptions: {
	// 			pie: {
	// 				size?: number;
	// 				donut: {
	// 					size: string;
	// 				};
	// 			};
	// 		};
	// 	};
	// }
	let { figures } = $props();
	let chartEl: HTMLDivElement;
	// let { options }: ChartOptions = $props();

	$effect(() => {
		const options = {
			chart: {
				type: 'donut',
			},

			series: [figures.percentageA, figures.percentageB, figures.percentageC, figures.percentageD],
			float_precision: 2,
			labels: ['A', 'B', 'C', 'D'],
			legend: { show: false },
			colors: ['#FED049', '#808836', '#FF9A00', '#D10363'],
			plotOptions: {
				pie: {
					// customScale: 0.2,
					size: 200,
					donut: {
						labels: {
							show: false,
							name: {},
							value: {},
						},
					},
				},
			},
			dataLabels: {
				enabled: true,
				formatter: function (val) {
					return val + '%';
				},
			},
		};
		const chart = new ApexCharts(chartEl, options);
		chart.render();
	});
</script>

<!-- <div bind:this={chartEl} class=""></div> -->
<div class="h-full max-h-[30rem] w-full max-w-[30rem] overflow-auto p-8">
	<div bind:this={chartEl} class=""></div>
</div>
