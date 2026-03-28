import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, updateDoc, deleteDoc, doc, Timestamp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// --- INITIALIZE FIREBASE ---
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) {
    console.error("Firebase Initialization Failed. Please check your config in firebase-config.js", e);
}

// --- GLOBALS ---
let fxRate = 46;
let expenses = [];
let currentCurrency = 'KRW';
let activeFilterDate = 'all';
let initialLoadDone = false;

const TRIP_DATES = {
    '2026-03-29': 'D1',
    '2026-03-30': 'D2',
    '2026-03-31': 'D3',
    '2026-04-01': 'D4',
    '2026-04-02': 'D5',
    '2026-04-03': 'D6',
    '2026-04-04': 'D7'
};

// --- UTILS ---
function getSavedFxRate() {
    const saved = localStorage.getItem('fxRate');
    if (saved) {
        fxRate = parseFloat(saved);
        const display = document.getElementById('fx-display');
        if (display) display.innerText = `匯率 1 : ${fxRate}`;
    }
}

window.changeFxRate = function () {
    const newRate = prompt("請輸入當前的韓元對台幣匯率 (例如 46 或 45.5):", fxRate);
    if (newRate !== null && !isNaN(newRate) && newRate > 0) {
        fxRate = parseFloat(newRate);
        localStorage.setItem('fxRate', fxRate);
        const display = document.getElementById('fx-display');
        if (display) display.innerText = `匯率 1 : ${fxRate}`;

        // 立即更新所有計算數值
        updateTotals();
        renderExpenses();
    }
}

function formatNumber(n) {
    return Math.round(n).toLocaleString();
}

function updateTotals() {
    const totalKrw = expenses.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const totalTwd = Math.round(totalKrw / fxRate);

    const behalfItems = expenses.filter(item => item.isOnBehalf);
    const behalfKrw = behalfItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const behalfTwd = Math.round(behalfKrw / fxRate);

    document.getElementById('total-krw').innerText = formatNumber(totalKrw);
    document.getElementById('total-twd').innerText = formatNumber(totalTwd);
    document.getElementById('behalf-krw').innerText = formatNumber(behalfKrw);
    document.getElementById('behalf-twd').innerText = formatNumber(behalfTwd);
}

// --- UI RENDER ---
function renderExpenses() {
    const container = document.getElementById('expense-container');
    if (!container) return;

    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="glass-card p-10 mt-16 rounded-3xl text-center text-slate-400">
                <i class="fas fa-receipt text-5xl mb-4 opacity-20"></i>
                <p class="font-bold">目前還沒有任何支出喔<br>點擊上方按鈕開始記帳吧！</p>
            </div>
        `;
        return;
    }

    // 過濾邏輯
    let groupedExpenses = expenses;
    if (activeFilterDate !== 'all') {
        groupedExpenses = expenses.filter(item => item.date === activeFilterDate);
    }

    if (groupedExpenses.length === 0) {
        container.innerHTML = `
            <div class="glass-card p-10 mt-1 rounded-3xl text-center text-slate-400">
                <i class="fas fa-calendar-day text-5xl mb-4 opacity-20"></i>
                <p class="font-bold">${activeFilterDate === 'all' ? '目前還沒有任何支出喔' : '此日期尚無支出項目喔'}<br>點擊上方按鈕開始記帳吧！</p>
            </div>
        `;
        return;
    }

    // 按日期分組
    const groups = {};
    groupedExpenses.forEach(item => {
        const d = item.date;
        if (!groups[d]) groups[d] = [];
        groups[d].push(item);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => a.localeCompare(b));

    container.innerHTML = sortedDates.map(date => `
        <div class="mb-6">
            <div class="flex items-center gap-3 mb-3 ml-2">
                <span class="text-sm font-black text-slate-400 uppercase tracking-widest">${date.replace(/-/g, '/')}</span>
                <div class="h-px bg-slate-200 flex-1"></div>
            </div>
            <div class="space-y-3">
                ${groups[date].map(item => {
        const twdAmount = item.currency === 'TWD' ? item.originalPrice : Math.round(item.price / fxRate);
        const krwAmount = item.price;
        const isOnBehalf = item.isOnBehalf === true;

        return `
                    <div class="glass-card expense-card p-5 rounded-[2rem] flex items-center justify-between border-white/40 shadow-sm relative group">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <div class="min-w-0">
                                ${isOnBehalf ? `
                                <div class="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 text-[10px] font-black uppercase tracking-wider mb-1.5 border border-indigo-100/50">
                                    <i class="fas fa-hand-holding-dollar mr-1"></i> 代付
                                </div>` : ''}
                                <h4 class="font-bold text-slate-800 truncate flex items-center gap-2 text-lg">
                                    ${item.name}
                                </h4>
                                ${item.remark ? `<p class="text-xs text-slate-400 truncate">${item.remark}</p>` : ''}
                            </div>
                        </div>
                        <div class="text-right flex items-center gap-4 ml-4">
                            <div>
                                <div class="font-black ${isOnBehalf ? 'text-indigo-600' : 'text-slate-800'} text-xl">
                                    <span class="text-xs text-slate-400 font-bold mr-1">TWD</span> ${formatNumber(twdAmount)}
                                </div>
                                ${item.currency === 'KRW' ? `
                                <div class="text-sm font-bold text-slate-400">
                                    ${formatNumber(krwAmount)} <span class="text-[10px] uppercase font-bold">KRW</span>
                                </div>` : ''}
                            </div>
                            <button onclick="window.openEditModal('${item.id}')" class="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:text-sky-600 hover:bg-sky-50 transition-all active:scale-90">
                                <i class="fas fa-pen text-sm"></i>
                            </button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        </div>
    `).join('');
    updateTotals();
}

function renderDaySelector() {
    const selector = document.getElementById('day-selector');
    if (!selector) return;

    // 取得所有有支出的日期，並與旅程基準日合併
    const expenseDates = [...new Set(expenses.map(item => item.date))];
    const allDates = [...new Set([...Object.keys(TRIP_DATES), ...expenseDates])];
    allDates.sort((a, b) => a.localeCompare(b));

    let html = `
        <button onclick="setFilterDate('all')" 
            class="ledger-day-btn snap-center flex-shrink-0 px-6 py-4 rounded-3xl bg-white shadow-sm border border-slate-100 min-w-[90px] font-bold text-center ${activeFilterDate === 'all' ? 'active-day' : ''}" 
            data-date="all">
            <span class="block text-[14px] opacity-50 uppercase mb-1">ALL</span>
            全部
        </button>
    `;

    allDates.forEach(date => {
        const dayLabel = TRIP_DATES[date] || 'EXTRA';
        const dateParts = date.split('-');
        const displayDate = dateParts.length >= 3 ? `${parseInt(dateParts[1])}/${parseInt(dateParts[2])}` : date;

        html += `
            <button onclick="setFilterDate('${date}')" 
                class="ledger-day-btn snap-center flex-shrink-0 px-6 py-4 rounded-3xl bg-white shadow-sm border border-slate-100 min-w-[90px] font-bold text-center ${activeFilterDate === date ? 'active-day' : ''}" 
                data-date="${date}">
                <span class="block text-[14px] opacity-50 uppercase mb-1">${dayLabel}</span>
                ${displayDate}
            </button>
        `;
    });

    selector.innerHTML = html;
}

// --- MODAL LOGIC ---
window.openModal = function () {
    const modal = document.getElementById('expense-modal');
    const content = document.getElementById('modal-content');
    const form = document.getElementById('expense-form');
    const title = document.getElementById('modal-title');
    const delBtn = document.getElementById('delete-btn');

    // Reset Form
    form.reset();
    document.getElementById('entry-id').value = '';
    document.getElementById('entry-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-calc-res').innerText = '0';
    title.innerText = "新增支出項目";
    delBtn.classList.add('hidden');
    document.getElementById('entry-behalf').checked = false;
    window.setCurrency('KRW');

    modal.classList.remove('hidden');
    setTimeout(() => content.classList.remove('translate-y-full'), 10);
};

window.openEditModal = function (id) {
    const item = expenses.find(e => e.id === id);
    if (!item) return;

    window.openModal();

    document.getElementById('modal-title').innerText = "編輯支出內容";
    document.getElementById('entry-id').value = item.id;
    document.getElementById('entry-date').value = item.date;
    document.getElementById('entry-name').value = item.name;
    document.getElementById('entry-price').value = item.currency === 'TWD' ? item.originalPrice : item.price;
    document.getElementById('entry-remark').value = item.remark || '';
    document.getElementById('entry-behalf').checked = item.isOnBehalf || false;
    document.getElementById('delete-btn').classList.remove('hidden');
    window.setCurrency(item.currency || 'KRW');

    // Trigger price display
    const val = parseFloat(document.getElementById('entry-price').value);
    const res = item.currency === 'TWD' ? Math.round(val * fxRate) : Math.round(val / fxRate);
    document.getElementById('modal-calc-res').innerText = formatNumber(res);
};

window.closeModal = function () {
    const modal = document.getElementById('expense-modal');
    const content = document.getElementById('modal-content');
    content.classList.add('translate-y-full');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

window.setCurrency = function (cur) {
    currentCurrency = cur;
    const btnKrw = document.getElementById('btn-krw');
    const btnTwd = document.getElementById('btn-twd');
    const priceLabel = document.getElementById('price-label');
    const calcLabel = document.getElementById('calc-label');

    if (cur === 'KRW') {
        btnKrw.classList.add('active');
        btnTwd.classList.remove('active');
        priceLabel.innerText = '金額 (KRW)';
        calcLabel.innerText = '換算台幣';
    } else {
        btnTwd.classList.add('active');
        btnKrw.classList.remove('active');
        priceLabel.innerText = '金額 (TWD)';
        calcLabel.innerText = '換算韓元';
    }

    // Recalculate preview
    const val = parseFloat(document.getElementById('entry-price').value) || 0;
    const res = cur === 'KRW' ? Math.round(val / fxRate) : Math.round(val * fxRate);
    document.getElementById('modal-calc-res').innerText = formatNumber(res);
}

window.setFilterDate = function (date) {
    activeFilterDate = date;

    // 更新橫向捲軸按鈕狀態
    document.querySelectorAll('.ledger-day-btn').forEach(btn => {
        if (btn.dataset.date === date) {
            btn.classList.add('active-day');
        } else {
            btn.classList.remove('active-day');
        }
    });

    renderExpenses();
}

function scrollToActiveDate() {
    const activeBtn = document.querySelector('.ledger-day-btn.active-day');
    if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// Real-time calculation in modal
document.getElementById('entry-price')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    const res = currentCurrency === 'KRW' ? Math.round(val / fxRate) : Math.round(val * fxRate);
    document.getElementById('modal-calc-res').innerText = formatNumber(res);
});

// --- DATABASE OPERATIONS ---
async function saveEntry(e) {
    e.preventDefault();
    if (!db) {
        alert("Firebase 尚未設定完成喔！請先檢查 firebase-config.js");
        return;
    }

    const id = document.getElementById('entry-id').value;
    const inputPrice = parseFloat(document.getElementById('entry-price').value);
    const normalizedPrice = currentCurrency === 'TWD' ? Math.round(inputPrice * fxRate) : inputPrice;

    const data = {
        date: document.getElementById('entry-date').value,
        name: document.getElementById('entry-name').value,
        currency: currentCurrency,
        originalPrice: inputPrice,
        price: normalizedPrice,
        remark: document.getElementById('entry-remark').value,
        isOnBehalf: document.getElementById('entry-behalf').checked,
        updatedAt: Timestamp.now()
    };

    try {
        if (id) {
            // Update
            await updateDoc(doc(db, "expenses", id), data);
        } else {
            // Add
            data.createdAt = Timestamp.now();
            await addDoc(collection(db, "expenses"), data);
        }
        window.closeModal();
    } catch (err) {
        console.error("Save failed", err);
        alert("資料儲存失敗了，請檢查您的 Firebase 設定與權限（或是不是沒連網？）");
    }
}

window.deleteEntry = async function () {
    const id = document.getElementById('entry-id').value;
    if (!id) return;

    if (!confirm("確定要刪除這筆支出嗎？")) return;

    try {
        await deleteDoc(doc(db, "expenses", id));
        window.closeModal();
    } catch (err) {
        console.error("Delete failed", err);
        alert("刪除失敗，請檢查系統權限。");
    }
};

// --- INIT ---
document.getElementById('expense-form')?.addEventListener('submit', saveEntry);

function init() {
    getSavedFxRate();

    if (db) {
        // 使用不帶排序的查詢，改用本地端排序以避免需要手動建立 Firebase 索引
        const q = collection(db, "expenses");
        onSnapshot(q, (snapshot) => {
            expenses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 本地端排序：先按日期 asc，再按建立時間 asc
            expenses.sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;

                // 如果日期相同，比較建立時間 (createdAt)
                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;
                return timeA - timeB;
            });

            renderDaySelector();
            renderExpenses();

            // 首次讀取後，自動對應當天日期
            if (!initialLoadDone) {
                const today = new Date().toISOString().split('T')[0];
                const hasTodayBtn = document.querySelector(`[data-date="${today}"]`);
                if (hasTodayBtn) {
                    window.setFilterDate(today);
                    setTimeout(scrollToActiveDate, 100);
                } else {
                    // 如果今天不在列表中，則選取全部並置中滾動
                    setTimeout(scrollToActiveDate, 100);
                }
                initialLoadDone = true;
            }
        }, (err) => {
            console.error("Fetch failed", err);
            document.getElementById('expense-container').innerHTML = `
                <div class="glass-card p-10 rounded-3xl text-center text-red-400">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p class="font-bold">資料讀取失敗！<br><span class="text-xs opacity-70">請確認 Firebase Config 是否正確且 Firestore 規則已開啟。</span></p>
                </div>
            `;
        });
    } else {
        // No Database Configured
        document.getElementById('expense-container').innerHTML = `
            <div class="glass-card p-10 rounded-3xl text-center text-amber-500">
                <i class="fas fa-cog fa-spin text-4xl mb-4"></i>
                <p class="font-bold text-lg mb-2">等一下，Firebase 還沒設定！</p>
                <p class="text-xs opacity-70 leading-relaxed">請在檔案中填寫 <b>firebase-config.js</b> 的資料，<br>才能啟動雲端記帳功能喔。<br>做工程很累，但設定好就很療癒了呵呵。</p>
            </div>
        `;
    }
}

window.addEventListener('load', init);
