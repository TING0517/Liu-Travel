import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, onSnapshot, query, orderBy, where, getDoc, doc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import { trips } from './data/config.js';

// --- INITIALIZE FIREBASE ---
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) { console.error(e); }

// --- GET URL PARAMS ---
const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get('tripId') || '2026_busan';
const currentTrip = trips.find(t => t.id === tripId) || trips[0];
const tripCurrency = currentTrip.currency || 'KRW';

// --- GLOBALS ---
let fxRate = 46;
let expenses = [];
let activeFilterDate = 'all';

const getExpensePath = () => `${tripId}_expenses`;

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.classList.add('hidden');
    }
}

// --- UI INIT ---
function setupUI() {
    document.title = `${currentTrip.name} - 花費紀錄`;

    // 更新 Header
    const nameEl = document.getElementById('trip-name');
    if (nameEl) nameEl.innerText = currentTrip.name;

    const dateEl = document.getElementById('trip-date');
    if (dateEl) {
        const startStr = currentTrip.startDate.replace(/-/g, '.');
        const endStr = currentTrip.endDate.replace(/-/g, '.');
        dateEl.innerHTML = `<i class="fas fa-calendar-day mr-1"></i> ${startStr} - ${endStr}`;
    }

    // 底部導覽列切換連結
    const navItinerary = document.getElementById('nav-link-itinerary');
    if (navItinerary) navItinerary.href = `history_index.html?tripId=${tripId}`;
}

async function fetchSettings() {
    // 改為直接從 config.js 讀取寫死的結算匯率，不再去 Firebase 抓取
    fxRate = currentTrip.fxRate;
    const op = currentTrip.fxOperator;

    // 顯示方式統一為 匯率 {幣別} : {數值}
    document.getElementById('fx-display').innerText = `匯率 ${tripCurrency} : ${fxRate}`;
}

async function fetchExpenses() {
    if (!db) return;
    const q = collection(db, getExpensePath());

    onSnapshot(q, (snapshot) => {
        expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 排序改為：日期先行，同日期則按 createdAt 早到晚
        expenses.sort((a, b) => {
            const dateComp = a.date.localeCompare(b.date);
            if (dateComp !== 0) return dateComp;
            return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
        });

        renderDaySelector();
        renderExpenses();
        hideLoading();
    }, (err) => {
        console.error(err);
        hideLoading();
    });
}

function formatNumber(n) {
    return Math.round(n).toLocaleString();
}

function updateTotals() {
    let totalTwdCount = 0;
    let behalfTwdCount = 0;

    const op = currentTrip.fxOperator;

    expenses.forEach(item => {
        // 台幣計算
        let entryTwd = item.originalPrice;
        if (item.currency !== 'TWD') {
            entryTwd = op === 'multiply' ? (item.price * fxRate) : (item.price / fxRate);
        }
        totalTwdCount += entryTwd;
        if (item.isOnBehalf) behalfTwdCount += entryTwd;
    });

    const totalTwdEl = document.getElementById('total-twd');
    const behalfTwdEl = document.getElementById('behalf-twd');

    if (totalTwdEl) totalTwdEl.innerText = formatNumber(totalTwdCount);
    if (behalfTwdEl) behalfTwdEl.innerText = formatNumber(behalfTwdCount);
}

function renderExpenses() {
    const container = document.getElementById('expense-container');
    if (!container) return;

    let filtered = activeFilterDate === 'all' ? expenses : expenses.filter(e => e.date === activeFilterDate);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="glass-card p-10 rounded-[2rem] text-center text-slate-400">該日期尚無歷史支出</div>`;
        updateTotals();
        return;
    }

    const groups = {};
    filtered.forEach(item => {
        if (!groups[item.date]) groups[item.date] = [];
        groups[item.date].push(item);
    });

    const sortedDates = Object.keys(groups).sort();

    container.innerHTML = sortedDates.map(date => `
        <div class="mb-6">
            <div class="flex items-center gap-3 mb-3 ml-2">
                <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">${date.replace(/-/g, '/')}</span>
                <div class="h-px bg-slate-200/50 flex-1"></div>
            </div>
            <div class="space-y-3">
                ${groups[date].map(item => {
        const op = currentTrip.fxOperator;
        const twdAmount = item.currency === 'TWD' ? item.originalPrice : Math.round(op === 'multiply' ? (item.price * fxRate) : (item.price / fxRate));
        return `
                    <div class="glass-card p-5 rounded-[1.8rem] flex items-center justify-between border-white/40 shadow-sm">
                        <div class="min-w-0 flex-1">
                            ${item.isOnBehalf ? `<span class="inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-500 text-[9px] font-black uppercase mb-1 border border-indigo-100">代付</span>` : ''}
                            <h4 class="font-bold text-slate-800 truncate text-lg">${item.name}</h4>
                            ${item.remark ? `<p class="text-[11px] text-slate-400 truncate mt-0.5">${item.remark}</p>` : ''}
                        </div>
                        <div class="text-right ml-4 flex items-center gap-3">
                            <div>
                                <div class="font-black ${item.isOnBehalf ? 'text-indigo-600' : 'text-slate-800'} text-xl">
                                    <span class="text-[10px] text-slate-400 font-bold mr-1">TWD</span>${formatNumber(twdAmount)}
                                </div>
                                ${item.currency !== 'TWD' ? `<div class="text-[10px] font-bold text-slate-400 opacity-60">${formatNumber(item.price)} ${item.currency}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>
    `).join('');
    updateTotals();
}

// 升級版日期選擇器：包含「額外記帳日期」
function renderDaySelector() {
    const selector = document.getElementById('day-selector');
    if (!selector) return;

    // 1. 生成原始行程日期範圍
    const start = new Date(currentTrip.startDate);
    const end = new Date(currentTrip.endDate);
    const dateRange = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dateRange.push(d.toISOString().split('T')[0]);
    }

    // 2. 獲取實際有記帳的日期
    const expenseDates = [...new Set(expenses.map(item => item.date))];

    // 3. 聯集並排序
    const allUniqueDates = [...new Set([...dateRange, ...expenseDates])].sort();

    let html = `
        <button onclick="window.setFilterDate('all')" class="day-btn snap-center flex-shrink-0 px-6 py-4 rounded-[1.5rem] bg-white shadow-sm border border-slate-100 min-w-[90px] font-bold text-center ${activeFilterDate === 'all' ? 'active-day' : ''}" data-date="all">
            <span class="block text-[12px] opacity-50 uppercase mb-1">ALL</span>
            全部
        </button>
    `;

    allUniqueDates.forEach((date) => {
        const isTripDay = dateRange.includes(date);
        const dayIdx = dateRange.indexOf(date);
        const dayLabel = isTripDay ? `D${dayIdx + 1}` : 'Extra';
        const displayDate = date.split('-').slice(1).join('/');

        html += `
            <button onclick="window.setFilterDate('${date}')" class="day-btn snap-center flex-shrink-0 px-6 py-4 rounded-[1.5rem] bg-white shadow-sm border border-slate-100 min-w-[90px] font-bold text-center ${activeFilterDate === date ? 'active-day' : ''}" data-date="${date}">
                <span class="block text-[12px] opacity-50 uppercase mb-1">${dayLabel}</span>
                ${displayDate}
            </button>
        `;
    });
    selector.innerHTML = html;
}

window.setFilterDate = function (date) {
    activeFilterDate = date;
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.toggle('active-day', btn.dataset.date === date));
    renderExpenses();
}

// --- INIT ---
window.onload = async () => {
    setupUI();
    await fetchSettings();
    fetchExpenses();
};
