<template>
  <div class="dashboard">
    <!-- 顶部统计卡片 -->
    <div class="stat-row">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.iconBg }">
          <el-icon :size="26" :color="stat.iconColor">
            <component :is="stat.icon" />
          </el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </div>
    </div>

    <!-- 主折线图：expected vs actual -->
    <div class="chart-card">
      <div ref="lineChartRef" class="chart-el chart-el--tall"></div>
    </div>

    <!-- 三个图表：雷达图 / 基础南丁格尔玫瑰图 / 柱状图 -->
    <div class="chart-row">
      <div class="chart-card chart-card--third">
        <div ref="radarChartRef" class="chart-el"></div>
      </div>
      <div class="chart-card chart-card--third">
        <div ref="roseChartRef" class="chart-el"></div>
      </div>
      <div class="chart-card chart-card--third">
        <div ref="barChartRef" class="chart-el"></div>
      </div>
    </div>
  </div>
</template>

<script setup name="Dashboard">
import * as echarts from 'echarts'
import { User, ChatDotRound, Money, ShoppingCart } from '@element-plus/icons-vue'

/** 顶部统计卡片数据。这里先给出
 * 结构化的静态数据，后续接入时只需要把 value 换成接口返回值。 */
const stats = [
  { label: '点击', value: '102,400', icon: User, iconBg: '#e3f9f5', iconColor: '#12c2ad' },
  { label: '文章', value: '81,212', icon: ChatDotRound, iconBg: '#e8f2ff', iconColor: '#3aa1ff' },
  { label: '访客', value: '9,280', icon: Money, iconBg: '#fde9ec', iconColor: '#f5385d' },
  { label: '时长', value: '13,600', icon: ShoppingCart, iconBg: '#e6f7ef', iconColor: '#1fbf75' }
]

const lineChartRef = ref(null)
const radarChartRef = ref(null)
const roseChartRef = ref(null)
const barChartRef = ref(null)

let lineChart, radarChart, roseChart, barChart

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const expectedData = [100, 120, 163, 110, 100, 160, 163]
const actualData = [120, 82, 92, 155, 165, 140, 145]

function initLineChart() {
  lineChart = echarts.init(lineChartRef.value)
  lineChart.setOption({
    title: {
      text: '网站访问数据和预测数据',
      textStyle: { color: '#8a94a6', fontSize: 13 },
    },
    color: ['#f5385d', '#3aa1ff'],
    legend: {
      top: 12,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#8a94a6', fontSize: 13 },
      data: ['expected', 'actual']
    },
    grid: { left: 45, right: 30, top: 70, bottom: 30 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: weekDays,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#3aa1ff' } },
      axisTick: { show: false },
      axisLabel: { color: '#8a94a6' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 180,
      interval: 30,
      splitLine: { lineStyle: { color: '#eef1f6' } },
      axisLabel: { color: '#8a94a6' }
    },
    series: [
      {
        name: 'expected',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#f5385d', borderColor: '#f5385d', borderWidth: 1 },
        lineStyle: { width: 2 },
        data: expectedData
      },
      {
        name: 'actual',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#3aa1ff', borderColor: '#3aa1ff', borderWidth: 1 },
        lineStyle: { width: 2 },
        data: actualData
      }
    ]
  })
}

// 雷达图—— Sales / Marketing / ...nistration 等，
function initRadarChart() {
  radarChart = echarts.init(radarChartRef.value)
  radarChart.setOption({
    title: { text: '职员雷达图', left: 'center', top: 12, textStyle: { fontSize: 14, color: '#5b6470' } },
    tooltip: {},
    color: ['#12c2ad'],
    radar: {
      indicator: [
        { name: 'Sales', max: 100 },
        { name: 'Marketing', max: 100 },
        { name: 'Administration', max: 100 },
        { name: 'HR', max: 100 },
        { name: 'IT', max: 100 }
      ],
      radius: '58%',
      center: ['50%', '58%'],
      splitArea: { areaStyle: { color: ['#ffffff', '#f7f9fc'] } },
      axisLine: { lineStyle: { color: '#e3e8f0' } },
      splitLine: { lineStyle: { color: '#e3e8f0' } },
      name: { textStyle: { color: '#8a94a6', fontSize: 12 } }
    },
    series: [
      {
        type: 'radar',
        areaStyle: { opacity: 0.25 },
        lineStyle: { width: 2 },
        data: [{ value: [82, 68, 74, 40, 90], name: '本季度' }]
      }
    ]
  })
}

// 基础南丁格尔玫瑰图——通常 4-6 个扇区更能体现"半径按数值变化"的效果，
function initRoseChart() {
  roseChart = echarts.init(roseChartRef.value)
  roseChart.setOption({
    title: { text: '行业分布图', left: 'center', top: 12, textStyle: { fontSize: 14, color: '#5b6470' } },
    tooltip: { trigger: 'item' },
    color: ['#f5385d', '#f5a623', '#12c2ad', '#3aa1ff', '#8a7ce8'],
    series: [
      {
        type: 'pie',
        radius: [20, 92],
        center: ['50%', '58%'],
        roseType: 'radius',
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { color: '#5b6470', fontSize: 12 },
        labelLine: { lineStyle: { color: '#c9d0dc' } },
        data: [
          { value: 40, name: 'Forecasts' },
          { value: 33, name: 'Gold' },
          { value: 28, name: 'Industry' },
          { value: 22, name: 'Services' },
          { value: 15, name: 'Others' }
        ]
      }
    ]
  })
}

// 季度对比柱状图。
function initBarChart() {
  barChart = echarts.init(barChartRef.value)
  barChart.setOption({
    title: { text: '季度访问数', left: 'center', top: 12, textStyle: { fontSize: 14, color: '#5b6470' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 55, right: 20, top: 70, bottom: 30 },
    color: ['#3aa1ff'],
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4'],
      axisLine: { lineStyle: { color: '#e3e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#8a94a6' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eef1f6' } },
      axisLabel: { color: '#8a94a6' }
    },
    series: [
      {
        type: 'bar',
        barWidth: '45%',
        itemStyle: { borderRadius: [6, 6, 0, 0] },
        data: [980, 1180, 900, 1050]
      }
    ]
  })
}

function handleResize() {
  lineChart?.resize()
  radarChart?.resize()
  roseChart?.resize()
  barChart?.resize()
}

onMounted(() => {
  initLineChart()
  initRadarChart()
  initRoseChart()
  initBarChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
  radarChart?.dispose()
  roseChart?.dispose()
  barChart?.dispose()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100%;
}

.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1 1 220px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  font-size: 14px;
  color: #8a94a6;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303540;
}

.chart-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 8px;
  margin-bottom: 20px;
}

.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-card--third {
  flex: 1 1 320px;
  margin-bottom: 0;
}

.chart-el {
  width: 100%;
  height: 320px;
}

.chart-el--tall {
  height: 420px;
}

@media screen and (max-width: 768px) {
  .stat-card {
    flex: 1 1 100%;
  }

  .chart-card--third {
    flex: 1 1 100%;
  }
}
</style>
