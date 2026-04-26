const KEY = 'vv_notifications';

export const getNotifications = () => JSON.parse(localStorage.getItem(KEY) || '[]');

export function addNotification(type, title, message) {
  const existing = getNotifications();
  const notif = { id: Date.now(), type, title, message, read: false, timestamp: new Date().toISOString() };
  const updated = [notif, ...existing].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function markAsRead(id) {
  const updated = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function markAllRead() {
  const updated = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function clearNotification(id) {
  const updated = getNotifications().filter(n => n.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
