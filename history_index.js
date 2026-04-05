import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, onSnapshot, query, orderBy, where, getDocs, Timestamp, writeBatch, doc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
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
const tripId = urlParams.get('tripId');
const currentTrip = trips.find(t => t.id === tripId);

// --- GLOBALS ---
let currentDay = 1;
let items = [];

const getItineraryPath = () => `${tripId}_itineraries`;

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.classList.add('hidden');
    }
}

// --- UI INIT ---
function setupUI() {
    document.getElementById('trip-name').innerText = currentTrip.name;
    document.title = `${currentTrip.name} - 歷史紀錄`;

    // 初始化日期範圍顯示
    renderDateRange();

    // 底部導覽列切換連結
    const navLedger = document.getElementById('nav-link-ledger');
    if (navLedger) navLedger.href = `history_ledger.html?tripId=${tripId}`;

    // 渲染航班資訊 (Dynamic)
    renderFlights();
}

function renderDateRange() {
    const dateEl = document.getElementById('trip-date');
    if (!dateEl) return;

    const startStr = currentTrip.startDate.replace(/-/g, '.');
    const endStr = currentTrip.endDate.replace(/-/g, '.');

    dateEl.innerHTML = `<i class="fas fa-calendar-day mr-1"></i> ${startStr} - ${endStr}`;
}

function renderFlights() {
    const grid = document.getElementById('flight-grid');
    if (!grid || !currentTrip.flights) return;

    grid.innerHTML = currentTrip.flights.map(f => `
        <div class="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-4">
            <div class="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center">
                <i class="fas fa-plane-${f.type === 'dep' ? 'departure' : 'arrival'} text-xs"></i>
            </div>
            <div class="flex-1 min-w-0">
                <span class="block opacity-60 text-[10px] font-bold uppercase tracking-wider truncate">${f.label}</span>
                <span class="font-bold text-sm truncate">${f.time}</span>
            </div>
        </div>
    `).join('');
}

async function fetchItinerary() {
    if (!db) return;
    const q = query(collection(db, getItineraryPath()));

    onSnapshot(q, (snapshot) => {
        items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderDaySelector();
        renderItinerary();
        hideLoading();
    }, (err) => {
        console.error(err);
        hideLoading();
    });
}

function renderDaySelector() {
    const container = document.getElementById('day-selector');
    if (!container) return;
    const start = new Date(currentTrip.startDate);
    const end = new Date(currentTrip.endDate);
    const daysCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let html = '';
    for (let i = 1; i <= daysCount; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + (i - 1));
        const dateStr = `${d.getMonth() + 1}/${d.getDate().toString().padStart(2, '0')}`;
        html += `
            <button onclick="window.switchDay(${i})" data-day="${i}"
                class="day-btn snap-center flex-shrink-0 px-6 py-4 rounded-[1.8rem] bg-white shadow-sm border border-slate-100 min-w-[100px] font-bold text-center ${i === currentDay ? 'active-day' : ''}">
                <span class="block text-[12px] opacity-50 uppercase mb-1">D${i}</span>
                ${dateStr}
            </button>
        `;
    }
    container.innerHTML = html;
}

window.switchDay = function (day) {
    currentDay = day;
    // 更新天數標籤
    const label = document.getElementById('current-day-label');
    if (label) label.innerText = day;

    // 不再隨天數切換更新 Header 日期，保持顯示完整範圍
    // updateHeaderDate(day);

    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.toggle('active-day', parseInt(btn.dataset.day) === day));
    renderItinerary();
}

function renderItinerary() {
    const container = document.getElementById('itinerary-container');
    if (!container) return;
    const dayItems = items.filter(item => item.day === currentDay).sort((a, b) => a.time.localeCompare(b.time));
    if (dayItems.length === 0) {
        container.innerHTML = `<div class="glass-card p-10 rounded-[2rem] text-center text-slate-400">目前尚無歷史行程資料</div>`;
        return;
    }
    container.innerHTML = dayItems
        .filter(item => item.type !== 'hotel')
        .map(item => {
            const dotClass = item.highlight ? 'bg-amber-500 ring-4 ring-amber-100' : (item.type === 'food' ? 'bg-emerald-500' : 'bg-sky-500');
            return `
            <div class="relative pl-12 timeline-line pb-6">
                <div class="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
                    <div class="w-4 h-4 rounded-full ${dotClass} z-10"></div>
                </div>
                <div class="glass-card p-5 rounded-[1.8rem]">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-bold text-slate-400 tracking-wider font-mono text-sm">${item.time}</span>
                        ${item.stay ? `<span class="text-[10px] bg-white/50 px-3 py-1 rounded-full text-slate-500 font-bold"> ${item.stay}</span>` : ''}
                    </div>
                    <h4 class="font-bold text-slate-800 text-lg">${item.text}</h4>
                </div>
            </div>
        `;
        }).join('');
    const hotelEl = document.getElementById('hotel-name');
    if (hotelEl) {
        const hotelItem = dayItems.find(i => i.type === 'hotel');
        hotelEl.innerText = hotelItem ? hotelItem.text.replace('今晚住宿：', '') : "尚未紀錄";
    }
}

// --- INIT ---
window.onload = () => {
    setupUI();
    fetchItinerary();
};
