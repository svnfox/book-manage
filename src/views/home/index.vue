<template>
  <AppPage show-footer>
    <n-card class="mt-12" title="⚡️ 趋势" segmented>
      <VChart :option="trendOption" :init-options="{ height: 400 }" autoresize />
    </n-card>
  </AppPage>
</template>

<script setup>
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

const trendOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  legend: {
    top: '5%',
    data: ['star', 'fork'],
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 3000,
      interval: 500,
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      type: 'value',
      min: 0,
      max: 500,
      interval: 100,
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: 'star',
      type: 'line',
      data: [200, 320, 520, 550, 600, 805, 888, 950, 1300, 2503, 2702, 2712],
    },
    {
      name: 'fork',
      yAxisIndex: 1,
      type: 'bar',
      data: [40, 72, 110, 115, 121, 175, 180, 201, 260, 398, 423, 455],
    },
  ],
}

// const skillOption = {
//   tooltip: {
//     trigger: 'item',
//     formatter({ name, value }) {
//       return `${name} ${value}%`
//     },
//   },
//   legend: {
//     left: 'center',
//   },
//   series: [
//     {
//       top: '12%',
//       type: 'pie',
//       radius: ['35%', '90%'],
//       avoidLabelOverlap: true,
//       itemStyle: {
//         borderRadius: 10,
//         borderColor: '#fff',
//         borderWidth: 2,
//       },
//       label: {
//         show: false,
//         position: 'center',
//       },
//       emphasis: {
//         label: {
//           show: true,
//           fontSize: 36,
//           fontWeight: 'bold',
//         },
//       },
//       labelLine: {
//         show: false,
//       },
//       data: [
//         { value: 38.5, name: 'Vue' },
//         { value: 37.0, name: 'JavaScript' },
//         { value: 6.5, name: 'CSS' },
//         { value: 6.2, name: 'HTML' },
//         { value: 1.8, name: 'Other' },
//       ],
//     },
//   ],
// }

// const message = $message
</script>
