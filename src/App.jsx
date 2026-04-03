import { useEffect, useMemo, useState } from 'react'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { botAlerts, orders, salesSeries } from './data.js'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
)

const FILTER_KEY = 'marketplace-dashboard-filters'

const defaultFilters = {
  period: '7',
  status: 'Все статусы',
}

function readSavedFilters() {
  try {
    const stored = localStorage.getItem(FILTER_KEY)
    return stored ? { ...defaultFilters, ...JSON.parse(stored) } : defaultFilters
  } catch {
    return defaultFilters
  }
}

export default function App() {
  const [filters, setFilters] = useState(readSavedFilters)
  const [exportState, setExportState] = useState('Экспорт в Excel')
  const [alerts, setAlerts] = useState(botAlerts)

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setAlerts((current) => {
        const [firstAlert, ...rest] = current
        return [...rest, firstAlert]
      })
    }, 5000)

    return () => window.clearInterval(timerId)
  }, [])

  const filteredOrders = useMemo(() => {
    const cutoff = new Date('2026-04-03')
    cutoff.setDate(cutoff.getDate() - Number(filters.period))

    return orders.filter((order) => {
      const dateMatches = new Date(order.date) >= cutoff
      const statusMatches =
        filters.status === 'Все статусы' || order.status === filters.status
      return dateMatches && statusMatches
    })
  }, [filters])

  const metrics = useMemo(() => {
    const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = filteredOrders.length
    const conversion = totalOrders ? (6.4 + totalOrders * 0.17).toFixed(1) : '0.0'
    const averageCheck = totalOrders ? Math.round(revenue / totalOrders) : 0

    return [
      { label: 'Выручка', value: `${revenue.toLocaleString('ru-RU')} ₽`, delta: '+18.4%' },
      { label: 'Заказы', value: totalOrders.toString(), delta: '+9.7%' },
      { label: 'Конверсия', value: `${conversion}%`, delta: '+1.2 п.п.' },
      { label: 'Средний чек', value: `${averageCheck.toLocaleString('ru-RU')} ₽`, delta: '+6.1%' },
    ]
  }, [filteredOrders])

  const exportToExcel = () => {
    setExportState('Готовим файл...')
    window.setTimeout(() => {
      setExportState('Файл выгружен ✓')
      window.setTimeout(() => setExportState('Экспорт в Excel'), 1800)
    }, 900)
  }

  const lineData = {
    labels: salesSeries.labels,
    datasets: [
      {
        label: 'Выручка',
        data: salesSeries.revenue,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        pointBackgroundColor: '#c4b5fd',
        fill: true,
        tension: 0.45,
      },
    ],
  }

  const barData = {
    labels: salesSeries.labels,
    datasets: [
      {
        label: 'Заказы',
        data: salesSeries.orders,
        borderRadius: 14,
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
      },
    ],
  }

  const doughnutData = {
    labels: ['Доставлен', 'В доставке', 'Новый', 'Отменён'],
    datasets: [
      {
        data: [
          filteredOrders.filter((order) => order.status === 'Доставлен').length,
          filteredOrders.filter((order) => order.status === 'В доставке').length,
          filteredOrders.filter((order) => order.status === 'Новый').length,
          filteredOrders.filter((order) => order.status === 'Отменён').length,
        ],
        backgroundColor: ['#22c55e', '#06b6d4', '#8b5cf6', '#ef4444'],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#cbd5e1', boxWidth: 14, usePointStyle: true },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' },
      },
    },
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <a className="logo" href="#top">
          Первый<span>Селлер</span>
        </a>
        <nav className="sidebar-nav">
          <a href="#top" className="active">Обзор</a>
          <a href="#orders">Заказы</a>
          <a href="#alerts">Telegram-бот</a>
          <a href="#analytics">Аналитика</a>
        </nav>
        <div className="sidebar-card">
          <p>Автоматизация</p>
          <strong>Webhook + парсер конкурентов</strong>
          <span>Имитация b2b-инструментов из резюме</span>
        </div>
      </aside>

      <main className="dashboard-main" id="top">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Marketplace dashboard</p>
            <h1>Продажи, заказы и алерты в одном интерфейсе</h1>
          </div>

          <div className="filters-row">
            <select
              value={filters.period}
              onChange={(event) => setFilters((prev) => ({ ...prev, period: event.target.value }))}
            >
              <option value="3">Последние 3 дня</option>
              <option value="7">Последние 7 дней</option>
              <option value="30">Последние 30 дней</option>
            </select>

            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option>Все статусы</option>
              <option>Новый</option>
              <option>В доставке</option>
              <option>Доставлен</option>
              <option>Отменён</option>
            </select>

            <button type="button" className="export-btn" onClick={exportToExcel}>
              {exportState}
            </button>
          </div>
        </header>

        <section className="metrics-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.delta}</span>
            </article>
          ))}
        </section>

        <section className="charts-grid" id="analytics">
          <article className="chart-card large">
            <div className="chart-head">
              <h2>Динамика выручки</h2>
              <span>Chart.js Line</span>
            </div>
            <div className="chart-box">
              <Line data={lineData} options={chartOptions} />
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-head">
              <h2>Заказы по дням</h2>
              <span>Bar</span>
            </div>
            <div className="chart-box">
              <Bar data={barData} options={chartOptions} />
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-head">
              <h2>Статусы заказов</h2>
              <span>Doughnut</span>
            </div>
            <div className="chart-box">
              <Doughnut
                data={doughnutData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: chartOptions.plugins }}
              />
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="orders-panel" id="orders">
            <div className="chart-head">
              <h2>Последние заказы</h2>
              <span>{filteredOrders.length} записей</span>
            </div>

            <div className="orders-table">
              <div className="table-row table-head">
                <span>ID</span>
                <span>Клиент</span>
                <span>Канал</span>
                <span>Статус</span>
                <span>Сумма</span>
              </div>

              {filteredOrders.map((order) => (
                <div className="table-row" key={order.id}>
                  <span>{order.id}</span>
                  <span>{order.customer}</span>
                  <span>{order.channel}</span>
                  <span className={`status-pill ${order.status === 'Отменён' ? 'danger' : ''}`}>
                    {order.status}
                  </span>
                  <span>{order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              ))}
            </div>
          </article>

          <article className="alerts-panel" id="alerts">
            <div className="chart-head">
              <h2>Telegram-уведомления</h2>
              <span>Live feed</span>
            </div>

            <div className="alerts-list">
              {alerts.map((alert, index) => (
                <div className={`alert-card ${index === 0 ? 'highlight' : ''}`} key={`${alert.id}-${index}`}>
                  <p>{alert.title}</p>
                  <strong>{alert.text}</strong>
                  <span>{alert.time}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
