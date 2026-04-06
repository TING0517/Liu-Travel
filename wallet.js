// --- CALCULATOR LOGIC ---

const currencies = {
    'KRW': { label: '韓元', op: 'divide', defaultRate: 46, promptInfo: '1 台幣 = ? 韓元 (例如 46)' },
    'JPY': { label: '日幣', op: 'multiply', defaultRate: 0.21, promptInfo: '1 日幣 = ? 台幣 (例如 0.21)' },
    'THB': { label: '泰銖', op: 'multiply', defaultRate: 0.95, promptInfo: '1 泰銖 = ? 台幣 (例如 0.95)' },
    'USD': { label: '美金', op: 'multiply', defaultRate: 31.5, promptInfo: '1 美金 = ? 台幣 (例如 31.5)' },
    'VND': { label: '越盾', op: 'divide', defaultRate: 800, promptInfo: '1 台幣 = ? 越盾 (例如 800)' }
};

let activeCurrency = localStorage.getItem('wallet_active_currency') || 'JPY';
let rates = JSON.parse(localStorage.getItem('wallet_rates')) || {};
let swapMode = false; // false: Foreign -> TWD, true: TWD -> Foreign

// Migrate legacy & init defaults
if (!rates['KRW']) {
    const legacy = localStorage.getItem('fxRate');
    rates['KRW'] = legacy ? parseFloat(legacy) : currencies['KRW'].defaultRate;
}
['JPY', 'THB', 'USD', 'VND'].forEach(c => {
    if (!rates[c]) rates[c] = currencies[c].defaultRate;
});

function saveRates() {
    localStorage.setItem('wallet_rates', JSON.stringify(rates));
}

window.setCurrency = function (code) {
    activeCurrency = code;
    localStorage.setItem('wallet_active_currency', code);

    // Update tabs
    Object.keys(currencies).forEach(c => {
        const btn = document.getElementById(`tab-${c}`);
        if (btn) {
            if (c === code) {
                btn.className = "flex-1 py-2 rounded-xl text-sm font-bold bg-white shadow-sm text-sky-600 transition-all";
            } else {
                btn.className = "flex-1 py-2 rounded-xl text-sm font-bold text-slate-400 transition-all";
            }
        }
    });

    // Update label
    updateDisplayLabels();

    // Update rate display
    const fxDisplay = document.getElementById('fx-rate-display');
    if (fxDisplay) {
        fxDisplay.innerText = `匯率 ${code} : ${rates[code]}`;
    }

    // Refresh calculation if not empty
    const display = document.getElementById('calc-display');
    if (display && display.innerText !== '0') {
        handleCalcInput();
    } else {
        updateTwdResult(0);
    }
}

window.toggleSwap = function () {
    swapMode = !swapMode;
    const display = document.getElementById('calc-display');
    if (display) display.innerText = '0';
    updateDisplayLabels();
    updateTwdResult(0);
}

function updateDisplayLabels() {
    const calcLabel = document.getElementById('calc-currency-label');
    const resLabel = document.getElementById('res-currency-label');
    const resUnit = document.getElementById('res-unit');

    if (swapMode) {
        if (calcLabel) calcLabel.innerText = `TWD`;
        if (resLabel) resLabel.innerText = activeCurrency;
        if (resUnit) resUnit.innerText = currencies[activeCurrency].label;
    } else {
        if (calcLabel) calcLabel.innerText = `${activeCurrency}`;
        if (resLabel) resLabel.innerText = 'TWD';
        if (resUnit) resUnit.innerText = '元';
    }
}

window.appendCalc = function (val) {
    const display = document.getElementById('calc-display');
    if (!display) return;
    if (display.innerText === '0' && val !== '.') {
        display.innerText = val;
    } else {
        display.innerText += val;
    }
    handleCalcInput();
}

window.clearCalc = function () {
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

window.performManualCalc = function () {
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

function updateTwdResult(val) {
    const el = document.getElementById('res-twd');
    if (!el) return;

    if (val === 0) {
        el.innerText = '0';
        return;
    }

    const cInfo = currencies[activeCurrency];
    const rate = rates[activeCurrency];
    let result = 0;

    if (!swapMode) {
        // Foreign -> TWD
        if (cInfo.op === 'divide') {
            result = val / rate;
        } else {
            result = val * rate;
        }
    } else {
        // TWD -> Foreign
        if (cInfo.op === 'divide') {
            result = val * rate;
        } else {
            result = val / rate;
        }
    }

    el.innerText = Math.round(result).toLocaleString();
}

window.changeFxRate = function () {
    const cInfo = currencies[activeCurrency];
    const newRate = prompt(`設定 ${cInfo.label} 匯率\n${cInfo.promptInfo}`, rates[activeCurrency]);
    if (newRate !== null && !isNaN(newRate) && newRate > 0) {
        rates[activeCurrency] = parseFloat(newRate);
        saveRates();
        setCurrency(activeCurrency); // Refresh display
    }
}

// --- INIT ---
window.addEventListener('load', () => {
    // 預設跳到 activeCurrency
    setCurrency(activeCurrency);
});
