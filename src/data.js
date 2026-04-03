export const orders = [
  { id: 'WB-10482', date: '2026-04-03', status: 'Доставлен', customer: 'Мария К.', channel: 'Wildberries', total: 18490, items: 4 },
  { id: 'OZ-98103', date: '2026-04-03', status: 'В доставке', customer: 'Алексей Р.', channel: 'Ozon', total: 12900, items: 2 },
  { id: 'YM-30449', date: '2026-04-02', status: 'Новый', customer: 'Дарья С.', channel: 'Яндекс Маркет', total: 28990, items: 5 },
  { id: 'WB-10411', date: '2026-04-02', status: 'Доставлен', customer: 'Илья В.', channel: 'Wildberries', total: 7590, items: 1 },
  { id: 'OZ-98044', date: '2026-04-01', status: 'Отменён', customer: 'Елена Т.', channel: 'Ozon', total: 4490, items: 1 },
  { id: 'YM-30190', date: '2026-04-01', status: 'Доставлен', customer: 'Никита А.', channel: 'Яндекс Маркет', total: 21450, items: 3 },
  { id: 'WB-10382', date: '2026-03-31', status: 'В доставке', customer: 'Анна П.', channel: 'Wildberries', total: 9820, items: 2 },
  { id: 'OZ-97961', date: '2026-03-30', status: 'Доставлен', customer: 'Роман Н.', channel: 'Ozon', total: 16300, items: 2 },
]

export const salesSeries = {
  labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  revenue: [124000, 149000, 132500, 178300, 196800, 224500, 208900],
  orders: [148, 176, 161, 214, 236, 251, 240],
}

export const botAlerts = [
  {
    id: 1,
    title: 'Telegram Bot: всплеск спроса',
    text: 'Категория "Смарт-часы" +18% к конверсии за последние 2 часа.',
    time: '2 минуты назад',
  },
  {
    id: 2,
    title: 'Webhook: изменение цены конкурента',
    text: 'У конкурента снизилась цена на SKU-1942. Рекомендуем проверить маржу.',
    time: '18 минут назад',
  },
  {
    id: 3,
    title: 'Парсер остатков',
    text: 'По 4 товарам запас меньше 10 единиц — стоит запланировать пополнение.',
    time: '42 минуты назад',
  },
]
