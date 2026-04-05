import { trips, getCurrentTripId } from './config.js';

/**
 * 套用指定行程的主題樣式
 * @param {string} tripId 
 */
export function applyTheme(tripId) {
    const trip = trips.find(t => t.id === tripId) || trips[0];
    const root = document.documentElement;
    
    // 1. 注入主題配色到 CSS 變數
    root.style.setProperty('--primary-color', trip.primaryColor);
    root.style.setProperty('--secondary-color', trip.secondaryColor);
    root.style.setProperty('--accent-color', trip.accentColor);
    
    // 2. 更新背景裝飾圖示 (對應 id="header-decoration")
    const decoEl = document.getElementById('header-decoration');
    if (decoEl && trip.icon) {
        decoEl.innerHTML = `<i class="fas ${trip.icon}"></i>`;
    }

    // 3. 更新頁面標題 (套用至 header 中的 h1，除非帶有 data-no-auto-title)
    const titleEl = document.querySelector('header h1');
    if (titleEl && !titleEl.hasAttribute('data-no-auto-title')) {
        titleEl.innerText = trip.name;
    }

    // 4. 更新行動裝置狀態列顏色
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', trip.primaryColor);
    }

    // 5. 更新 Day Label 顏色 (如果有)
    const dayLabels = document.querySelectorAll('.day-label-highlight');
    dayLabels.forEach(el => {
        el.style.backgroundColor = `${trip.primaryColor}15`; // 15% 透明度作為背景
        el.style.color = trip.primaryColor;
    });

    // 6. 更新貨幣標籤 (如果有)
    const currencyLabels = document.querySelectorAll('[data-currency-label]');
    currencyLabels.forEach(el => {
        el.innerText = el.innerText.replace(/KRW|JPY|THB|TWD/g, trip.currency || 'KRW');
    });
}

// 自動初始化：支援歷史頁面 (URL param) 與當前頁面 (localStorage)
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('tripId') || getCurrentTripId();
    applyTheme(tripId);
});
