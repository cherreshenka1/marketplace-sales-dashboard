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

export const botAlerts = [
  {id:1, title:'Новый заказ YM-30449', text:'В демо-реестре заказ на 28 990 ₽. Требуется передать в обработку.',time:'2 апреля, 12:40'},
  {id:2, title:'Отмена OZ-98044', text:'Заказ на 4 490 ₽ исключён из выручки. В таблице его можно найти по статусу.',time:'1 апреля, 16:15'},
  {id:3, title:'Доставка WB-10482', text:'Заказ на 18 490 ₽ отмечен доставленным.',time:'3 апреля, 10:30'},
]
