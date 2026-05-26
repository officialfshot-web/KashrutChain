// ShelfLife — Background Service Worker
// Handles daily expiry checks, badge updates, and notifications

// ==================== ALARMS ====================
const DAILY_ALARM = 'shelflife-daily-check';

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(DAILY_ALARM, { periodInMinutes: 60 * 24 }); // once per day
  runExpiryCheck();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === DAILY_ALARM) {
    runExpiryCheck();
  }
});

// ==================== EXPIRY CHECK ====================
function runExpiryCheck() {
  chrome.storage.local.get(['sl_inventory'], (res) => {
    const inventory = res.sl_inventory || [];
    const now = new Date();

    // Items expiring today or tomorrow
    const urgent = inventory.filter(item => {
      const diff = new Date(item.expiry) - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 2;
    });

    // Items already expired
    const expired = inventory.filter(item => {
      const diff = new Date(item.expiry) - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days < 0;
    });

    // Update badge
    const totalUrgent = urgent.length + expired.length;
    chrome.action.setBadgeText({ text: totalUrgent > 0 ? String(totalUrgent) : '' });
    chrome.action.setBadgeBackgroundColor({ color: expired.length > 0 ? '#ef4444' : '#f59e0b' });

    // Send notification for urgent items (once per day, avoid spam)
    if (urgent.length > 0 || expired.length > 0) {
      chrome.storage.local.get(['sl_last_notify'], (n) => {
        const last = n.sl_last_notify || 0;
        const today = now.toISOString().split('T')[0];
        if (last !== today) {
          chrome.storage.local.set({ sl_last_notify: today });
          sendExpiryNotification(urgent, expired);
        }
      });
    }
  });
}

// ==================== NOTIFICATIONS ====================
function sendExpiryNotification(urgent, expired) {
  let title, message;

  if (expired.length > 0) {
    title = `${expired.length} item(s) expired!`;
    message = `Open ShelfLife to check: ${expired.slice(0, 3).map(i => i.name).join(', ')}`;
  } else {
    title = `${urgent.length} item(s) expiring soon`;
    message = `Open ShelfLife to use them up: ${urgent.slice(0, 3).map(i => i.name).join(', ')}`;
  }

  chrome.notifications.create('shelflife-expiry', {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title,
    message,
    priority: 1
  });
}

// Click notification opens popup
chrome.notifications.onClicked.addListener((id) => {
  if (id === 'shelflife-expiry') {
    chrome.action.openPopup();
  }
});

// ==================== MESSAGES FROM POPUP ====================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'refresh-badge') {
    runExpiryCheck();
    sendResponse({ ok: true });
  }
});
