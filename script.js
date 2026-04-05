import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc, Timestamp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import { trips, getCurrentTripId } from './data/config.js';

// --- INITIALIZE FIREBASE ---
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) {
    console.error("Firebase Initialization Failed", e);
}

// --- GLOBALS ---
let currentDay = 1;
let fxRate = 46;
let itineraryItems = [];
const tripId = getCurrentTripId();
const currentTrip = trips.find(t => t.id === tripId) || trips[0];

const getItineraryPath = () => `${tripId}_itineraries`;

// --- ITINERARY CRUD LOGIC ---

async function fetchItinerary() {
    if (!db) return;
    const q = query(collection(db, getItineraryPath()));

    onSnapshot(q, (snapshot) => {
        itineraryItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItinerary();
        hideLoading();
    }, (err) => {
        console.error("Fetch itinerary failed", err);
        hideLoading();
    });
}

window.openItineraryModal = function (eventId = null) {
    const modal = document.getElementById('itinerary-modal');
    const content = document.getElementById('itinerary-modal-content');
    const form = document.getElementById('itinerary-form');
    const title = document.getElementById('itinerary-modal-title');
    const delBtn = document.getElementById('event-delete-btn');

    form.reset();
    document.getElementById('event-id').value = '';
    
    if (eventId) {
        const item = itineraryItems.find(i => i.id === eventId);
        if (item) {
            title.innerText = "編輯行程內容";
            document.getElementById('event-id').value = item.id;
            document.getElementById('event-time').value = item.time;
            document.getElementById('event-text').value = item.text;
            document.getElementById('event-stay').value = item.stay || '';
            document.getElementById('event-type').value = item.type || 'normal';
            document.getElementById('event-highlight').checked = item.highlight || false;
            delBtn.classList.remove('hidden');
        }
    } else {
        title.innerText = "新增行程項目";
        delBtn.classList.add('hidden');
        // 預設目前選取的天數
    }

    modal.classList.remove('hidden');
    setTimeout(() => content.classList.remove('translate-y-full'), 10);
};

window.closeItineraryModal = function () {
    const modal = document.getElementById('itinerary-modal');
    const content = document.getElementById('itinerary-modal-content');
    content.classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

async function handleItinerarySubmit(e) {
    e.preventDefault();
    if (!db) return;

    const id = document.getElementById('event-id').value;
    const data = {
        day: currentDay,
        time: document.getElementById('event-time').value,
        text: document.getElementById('event-text').value,
        stay: document.getElementById('event-stay').value,
        type: document.getElementById('event-type').value,
        highlight: document.getElementById('event-highlight').checked,
        updatedAt: Timestamp.now()
    };

    try {
        if (id) {
            await updateDoc(doc(db, getItineraryPath(), id), data);
        } else {
            data.createdAt = Timestamp.now();
            await addDoc(collection(db, getItineraryPath()), data);
        }
        window.closeItineraryModal();
    } catch (err) {
        console.error("Save itinerary failed", err);
        alert("儲存失敗，請檢查網路或 Firebase 設定。");
    }
}

window.deleteItineraryItem = async function () {
    const id = document.getElementById('event-id').value;
    if (!id || !confirm("確定要刪除這項行程嗎？")) return;

    try {
        await deleteDoc(doc(db, getItineraryPath(), id));
        window.closeItineraryModal();
    } catch (err) {
        console.error("Delete failed", err);
    }
};

// --- UTILS ---
function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.classList.add('hidden');
    }
}

// --- UI LOGIC ---

function switchDay(day) {
    currentDay = day;
    const label = document.getElementById('current-day-label');
    if (label) label.innerText = day;
    
    document.querySelectorAll('.day-btn').forEach((btn, idx) => {
        btn.classList.toggle('active-day', idx + 1 === day);
    });
    renderItinerary();
}
window.switchDay = switchDay;

function renderItinerary() {
    const container = document.getElementById('itinerary-container');
    if (!container) return;
    
    // 過濾出當天的行程並按時間排序
    const dayItems = itineraryItems
        .filter(item => item.day === currentDay)
        .sort((a, b) => a.time.localeCompare(b.time));

    if (dayItems.length === 0) {
        container.innerHTML = `
            <div class="glass-card p-10 rounded-[2.5rem] text-center text-slate-400">
                <i class="fas fa-map-marker-alt text-4xl mb-4 opacity-20"></i>
                <p class="font-bold">今日尚無行程紀錄<br>可以點右上角按鈕新增喔！</p>
            </div>
        `;
        return;
    }

    container.innerHTML = dayItems.map(item => {
        const dotClass = item.highlight ? 'bg-amber-500 ring-4 ring-amber-100' : (item.type === 'food' ? 'bg-emerald-500' : 'bg-sky-500');
        
        return `
            <div class="relative pl-12 timeline-line pb-6 group">
                <div class="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
                    <div class="w-4 h-4 rounded-full ${dotClass} z-10"></div>
                </div>
                <div class="glass-card p-5 rounded-3xl transition-all active:scale-[0.98] relative">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-slate-400 tracking-wider font-mono">${item.time}</span>
                        <div class="flex items-center gap-2">
                            ${item.stay ? `<span class="text-[12px] bg-sky-50 px-3 py-1 rounded-full text-sky-600 font-bold"> ${item.stay}</span>` : ''}
                            <button onclick="openItineraryModal('${item.id}')" class="edit-btn w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-sky-100 hover:text-sky-600 transition-all">
                                <i class="fas fa-pen text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                    <h4 class="font-bold text-slate-800 text-xl mb-3">${item.text}</h4>
                    <div class="flex gap-3">
                        <button onclick="openMap('${item.text}')" class="text-xs font-bold text-sky-600 bg-sky-50 px-4 py-2 rounded-xl">
                            <i class="fas fa-map-marker-alt mr-1"></i> 地圖
                        </button>
                        ${item.type === 'food' ? `
                            <button onclick="openBlog('${item.text}')" class="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                                <i class="fas fa-utensils mr-1"></i> 食記
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 更新飯店資訊 (這部分如果也要動態可以再改，目前先抓該天是否有 type='hotel')
    const hotelEl = document.getElementById('hotel-name');
    if (hotelEl) {
        const hotelItem = dayItems.find(i => i.type === 'hotel');
        hotelEl.innerText = hotelItem ? hotelItem.text.replace('飯店放行李-', '').replace('今晚住宿：', '') : "尚未決定住宿";
    }
}

window.openMap = (query) => window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
window.openBlog = (query) => window.open(`https://www.google.com/search?q=${encodeURIComponent(query + ' 食記')}`, '_blank');


// --- CALCULATOR LOGIC ---
window.appendCalc = function(val) {
    const display = document.getElementById('calc-display');
    if (!display) return;
    if (display.innerText === '0' && val !== '.') {
        display.innerText = val;
    } else {
        display.innerText += val;
    }
    handleCalcInput();
}

window.clearCalc = function() {
    const display = document.getElementById('calc-display');
    if (display) display.innerText = '0';
    updateTwdResult(0);
}

function handleCalcInput() {
    const input = document.getElementById('calc-display').innerText;
    const equalBtn = document.getElementById('calc-equal-btn');

    if (/[+\-*/]/.test(input)) {
        if (equalBtn) equalBtn.classList.remove('hidden');
        updateTwdResult(0);
    } else {
        if (equalBtn) equalBtn.classList.add('hidden');
        const val = parseFloat(input);
        if (!isNaN(val)) updateTwdResult(val);
        else updateTwdResult(0);
    }
}

window.performManualCalc = function() {
    const display = document.getElementById('calc-display');
    const input = display.innerText;
    try {
        const result = Function('"use strict";return (' + input + ')')();
        display.innerText = result;
        const equalBtn = document.getElementById('calc-equal-btn');
        if (equalBtn) equalBtn.classList.add('hidden');
        updateTwdResult(result);
    } catch (e) {
        alert("運算格式不正確哦");
    }
}

function updateTwdResult(krw) {
    const el = document.getElementById('res-twd');
    if (el) el.innerText = Math.round(krw / fxRate).toLocaleString();
}

window.changeFxRate = function() {
    const newRate = prompt("請輸入當前的韓元對台幣匯率 (例如 46 或 45.5):", fxRate);
    if (newRate !== null && !isNaN(newRate) && newRate > 0) {
        fxRate = parseFloat(newRate);
        localStorage.setItem('fxRate', fxRate);
        const display = document.getElementById('fx-rate-display');
        if (display) display.innerText = `匯率 1 : ${fxRate}`;
    }
}

// --- WEATHER LOGIC ---
async function fetchWeather() {
    const cities = [
        { name: 'Busan', displayName: '釜山', id: 'weather-busan', lat: 35.1796, lng: 129.0756 },
        { name: 'Daegu', displayName: '大邱', id: 'weather-daegu', lat: 35.8714, lng: 128.6014 }
    ];

    for (const city of cities) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true&daily=precipitation_probability_max&hourly=temperature_2m,precipitation_probability,weathercode&timezone=auto&forecast_days=3`;
            const res = await fetch(url);
            const data = await res.json();
            renderWeatherUI(city.id, data);
        } catch (e) {
            console.error(`Weather for ${city.name} failed`, e);
        }
    }
}

function renderWeatherUI(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const current = data.current_weather;
    const daily = data.daily;
    const hourly = data.hourly;
    const temp = Math.round(current.temperature);
    const weatherDesc = getWmoWeatherDesc(current.weathercode);
    const rainChance = daily.precipitation_probability_max[0] || 0;
    const obsTime = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

    let html = `
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4 text-white gap-8">
                <span class="text-6xl font-black tracking-tighter shrink-0">${temp}<sup class="text-3xl ml-1">° C</sup></span>
                <div class="text-right min-w-0">
                     <span class="block text-xl font-bold mb-1">${weatherDesc}</span>
                     <span class="block text-sm font-medium opacity-90">今日降雨機率 ${rainChance}%</span>
                </div>
            </div>
            <div class="text-[12px] text-white/60 mb-2 font-medium">觀測時間：今天 ${obsTime}</div>
        </div>
        <div class="pt-6 border-t border-white/20">
            <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black text-white/50 uppercase tracking-[0.2em]">未來預報</span>
                <span class="text-[10px] text-white/40"><i class="fas fa-arrows-left-right mr-1"></i> 左右滑動</span>
            </div>
            <div class="flex overflow-x-auto gap-4 pb-4 hide-scrollbar -mx-2 px-2 w-full">
    `;

    const now = new Date();
    for (let i = 0; i < hourly.time.length; i++) {
        const timeObj = new Date(hourly.time[i]);
        if (timeObj < new Date(now.getTime() - 60 * 60 * 1000)) continue;

        const hour = timeObj.getHours();
        const displayTime = hour === 0 ? `<span class="text-sky-300">${timeObj.getMonth() + 1}/${timeObj.getDate()}</span>` : `${hour}:00`;

        html += `
            <div class="flex-shrink-0 flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl py-4 px-3 min-w-[70px] border border-white/5">
                <span class="text-[11px] font-bold text-white/70 mb-2">${displayTime}</span>
                <i class="fas ${getWeatherIcon(hourly.weathercode[i])} text-lg text-white mb-2"></i>
                <span class="text-base font-black text-white mb-1">${Math.round(hourly.temperature_2m[i])}°</span>
                <div class="flex items-center gap-0.5 text-[10px] text-sky-200 font-bold">
                    <i class="fas fa-droplet scale-75"></i> ${hourly.precipitation_probability[i]}%
                </div>
            </div>
        `;
    }

    html += `</div></div>`;
    container.innerHTML = html;
}

function getWmoWeatherDesc(code) {
    const mapping = { 0: '晴朗', 1: '晴時多雲', 2: '多雲', 3: '陰天', 45: '霧', 48: '霧', 51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨', 61: '小雨', 63: '雨', 65: '大雨', 80: '陣雨', 81: '陣雨', 82: '強陣雨', 95: '雷雨' };
    return mapping[code] || '未知';
}

function getWeatherIcon(code) {
    if ([0, 1].includes(code)) return 'fa-sun';
    if ([2, 3].includes(code)) return 'fa-cloud-sun';
    if ([45, 48].includes(code)) return 'fa-smog';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'fa-cloud-showers-heavy';
    return 'fa-cloud';
}

// --- INIT ---
window.addEventListener('load', () => {
    // 匯率
    const savedRate = localStorage.getItem('fxRate');
    if (savedRate) {
        fxRate = parseFloat(savedRate);
        const fxDisplay = document.getElementById('fx-rate-display');
        if (fxDisplay) fxDisplay.innerText = `匯率 1 : ${fxRate}`;
    }

    // 行程
    if (document.getElementById('itinerary-container')) {
        fetchItinerary();
        document.getElementById('btn-add-event')?.addEventListener('click', () => window.openItineraryModal());
        document.getElementById('itinerary-form')?.addEventListener('submit', handleItinerarySubmit);
        
        // 自動天數 (可以保留原本 getAutoDay 邏輯)
        const startDate = new Date(currentTrip.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        let day = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        if (day < 1 || day > 7) day = 1;
        switchDay(day);
    }

    // 天氣
    if (document.getElementById('weather-busan')) fetchWeather();
});
