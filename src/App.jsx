import OpenContext from './OpenContext.jsx'
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
import { botAlerts, orders } from './data.js'

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
  const [exportState, setExportState] = useState('Скачать CSV')
  const [alerts, setAlerts] = useState(botAlerts)

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify(filters))
  }, [filters])

  const filteredOrders = useMemo(() => {
    const cutoff = new Date('2026-04-03')
    cutoff.setDate(cutoff.getDate() - Number(filters.period) + 1)

    return orders.filter((order) => {
      const dateMatches = new Date(order.date) >= cutoff
      const statusMatches =
        filters.status === 'Все статусы' || order.status === filters.status
      return dateMatches && statusMatches
    })
  }, [filters])

  const metrics = useMemo(() => {
    const revenue = filteredOrders.filter(order => order.status !== 'Отменён').reduce((sum, order) => sum + order.total, 0)
    const totalOrders = filteredOrders.length
    const delivered = filteredOrders.filter(order => order.status === 'Доставлен').length
    const validCount = filteredOrders.filter(order => order.status !== 'Отменён').length
    const averageCheck = validCount ? Math.round(revenue / validCount) : 0

    return [
      { label: 'Выручка', value: `${revenue.toLocaleString('ru-RU')} ₽`, delta: 'Без отменённых заказов' },
      { label: 'Заказы', value: totalOrders.toString(), delta: 'В выбранном периоде' },
      { label: 'Доставлено', value: String(delivered), delta: 'Подтверждённые доставки' },
      { label: 'Средний чек', value: `${averageCheck.toLocaleString('ru-RU')} ₽`, delta: 'По активным заказам' },
    ]
  }, [filteredOrders])

  const exportToExcel = () => {
    const rows = [['Заказ','Дата','Клиент','Канал','Статус','Сумма'],...filteredOrders.map(order=>[order.id,order.date,order.customer,order.channel,order.status,order.total])]
    const csv = '\uFEFF' + rows.map(row => row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); const a=document.createElement('a'); a.href=url; a.download='orders.csv'; a.click()
    setTimeout(()=>URL.revokeObjectURL(url),1000); setExportState('CSV подготовлен')
  }
  const dates = [...new Set(filteredOrders.map(order=>order.date))].sort()
  const chartSeries = {
    labels:dates.map(date=>new Date(date+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'})),
    revenue:dates.map(date=>filteredOrders.filter(order=>order.date===date&&order.status!=='Отменён').reduce((sum,order)=>sum+order.total,0)),
    orders:dates.map(date=>filteredOrders.filter(order=>order.date===date).length)
  }
  const lineData = {
    labels: chartSeries.labels,
    datasets: [
      {
        label: 'Выручка',
        data: chartSeries.revenue,
        borderColor: '#527566',
        backgroundColor: 'rgba(82, 117, 102, 0.12)',
        pointBackgroundColor: '#527566',
        fill: true,
        tension: 0.45,
      },
    ],
  }

  const barData = {
    labels: chartSeries.labels,
    datasets: [
      {
        label: 'Заказы',
        data: chartSeries.orders,
        borderRadius: 3,
        backgroundColor: '#72909b',
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
        backgroundColor: ['#668472', '#6c8f9d', '#527566', '#ad7965'],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#65746d', boxWidth: 14, usePointStyle: true },
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
          Seller<span>Desk</span>
        </a>
        <nav className="sidebar-nav">
          <a href="#top" className="active">Обзор</a>
          <a href="#orders">Заказы</a>
          <a href="#alerts">События</a>
          <a href="#analytics">Аналитика</a>
        </nav>
        <div className="sidebar-card">
          <p>Автоматизация</p>
          <strong>Рабочая сводка продавца</strong>
          <span>Демо-данные · 28 марта — 3 апреля 2026</span>
        </div>
      </aside>

      <main className="dashboard-main" id="top">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Обзор магазина</p>
            <h1>Как идут продажи</h1>
          </div>

          <div className="filters-row">
            <select aria-label="Период отчёта"
              value={filters.period}
              onChange={(event) => setFilters((prev) => ({ ...prev, period: event.target.value }))}
            >
              <option value="3">1–3 апреля</option>
              <option value="7">28 марта — 3 апреля</option>
              <option value="30">5 марта — 3 апреля</option>
            </select>

            <select aria-label="Статус заказа"
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
              <span>Без отменённых заказов</span>
            </div>
            <div className="chart-box">
              <Line data={lineData} options={chartOptions} />
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-head">
              <h2>Заказы по дням</h2>
              <span>За выбранный период</span>
            </div>
            <div className="chart-box">
              <Bar data={barData} options={chartOptions} />
            </div>
          </article>

          <article className="chart-card">
            <div className="chart-head">
              <h2>Статусы заказов</h2>
              <span>Доля по количеству</span>
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
              <span>Записей: {filteredOrders.length}</span>
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
              <h2>Журнал событий</h2>
              <span>Демо-события</span>
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
        <OpenContext/>
      </main>
    </div>
  )
}
