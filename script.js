// --- DATA ---
const itinerary = {
    1: [
        { time: "08:00", text: "飯店放行李-Toyoko Inn 釜山海雲臺", stay: "15分", type: "hotel" },
        { time: "08:20", text: "早餐-密陽血腸豬肉湯飯 海雲台店", stay: "1小時", type: "food" },
        { time: "09:25", text: "換錢-MONEYBOX HAEUNDAE", stay: "15分" },
        { time: "09:40", text: "海雲台海灘", stay: "20分" },
        { time: "10:30", text: "午餐、休息-CLUB D OASIS汗蒸幕", stay: "3小時", type: "food" },
        { time: "14:00", text: "00、30、45 海雲台藍線公園海岸列車(至松亭)", highlight: true },
        { time: "14:30", text: "松亭海水浴場", stay: "1.5小時" },
        { time: "16:00", text: "00、12、30 海雲台藍線公園海岸列車(至青沙浦天空步道)", highlight: true },
        { time: "16:20", text: "青沙浦天空步道", stay: "15分" },
        { time: "16:50", text: "青沙浦漁港", stay: "40分" },
        { time: "17:50", text: "膠囊列車 (至尾浦)", stay: "30分", highlight: true },
        { time: "18:40", text: "釜山 X the SKY", stay: "1小時" },
        { time: "20:00", text: "晚餐-味贊王鹽烤肉", stay: "1.5小時", type: "food" }
    ],
    2: [
        { time: "08:45", text: "海東龍宮寺", stay: "1.5小時" },
        { time: "10:30", text: "釜山樂天世界冒險樂園", stay: "3.5小時" },
        { time: "10:30", text: "Skyline Luge 釜山" },
        { time: "14:00", text: "午餐-Lotte Outlets(3F螞蟻家辣炒章魚 )", type: "food" },
        { time: "16:30", text: "16:30 鑽石灣遊艇碼頭", highlight: true },
        { time: "18:00", text: "晚餐、休息-SPA LAND 汗蒸幕", stay: "4小時" }
    ],
    3: [
        { time: "08:30", text: "行李寄放-東橫INN 釜山中央站" },
        { time: "10:00", text: "松島纜車、龍宮雲橋", stay: "2.5小時" },
        { time: "12:30", text: "松島天空步道", stay: "20分" },
        { time: "13:30", text: "午餐-國際炸雞", type: "food" },
        { time: "13:30", text: "國際市場巡禮(紅豆奶油艾草麻吉)", stay: "2小時" },
        { time: "15:50", text: "白淺灘文化村", stay: "2小時" },
        { time: "18:30", text: "晚餐-Lee Jae Mo Pizza", type: "food" },
        { time: "20:50", text: "樂天超市 光慶店", stay: "1小時" }
    ],
    4: [
        { time: "09:00", text: "甘川洞文化村", stay: "3小時" },
        { time: "12:20", text: "午餐-南浦雪農湯", type: "food" },
        { time: "13:20", text: "札嘎其市場 & BIFF 廣場", stay: "3小時" },
        { time: "16:00", text: "南川洞櫻花路", highlight: true },
        { time: "16:01", text: "廣安里海水浴場", stay: "3小時" },
        { time: "19:30", text: "晚餐-明倫進士烤肉", type: "food" }
    ],
    5: [
        { time: "09:00", text: "釜山至鎮海", highlight: true },
        { time: "10:30", text: "慶和站公園 (櫻花鐵道)", stay: "1.5小時" },
        { time: "12:30", text: "余佐川櫻花徑", stay: "4小時" },
        { time: "18:00", text: "西面巡禮 & 匠人鐵板雞", type: "food" }
    ],
    6: [
        { time: "09:00", text: "太宗台", stay: "3小時" },
        { time: "12:40", text: "午餐-影島海女村", type: "food" },
        { time: "14:25", text: "東山海水川櫻花路", stay: "1小時" },
        { time: "15:40", text: "下午茶-P.ARK", type: "food", stay: "1.5小時" },
        { time: "17:15", text: "晚餐-豆田裡", type: "food", stay: "1.5小時" },
        { time: "19:00", text: "拿行李-東橫INN 釜山中央站" },
        { time: "19:30", text: "搭 SRT / KTX 至東大邱", highlight: true }
    ],
    7: [
        { time: "09:30", text: "大邱近代胡同 (青蘿丘、大邱第一教會、三一運動路、桂山聖堂)" },
        { time: "11:20", text: "午餐-巨松燉排骨", type: "food" },
        { time: "12:45", text: "藥令市韓醫藥博物館" },
        { time: "13:55", text: "下午茶-星巴克鐘路古宅店" },
        { time: "15:45", text: "西門市場 (買棉被)", highlight: true },
        { time: "17:15", text: "晚餐-PURADAK CHICKEN", type: "food", stay: "1.5小時" },
        { time: "19:10", text: "拿行李-大邱水晶飯店" },
        { time: "20:10", text: "抵達大邱國際機場" }
    ]
};

const hotels = {
    1: "東橫inn釜山海雲台2", 2: "東橫inn釜山海雲台2",
    3: "東橫inn釜山中央店", 4: "東橫inn釜山中央店", 5: "東橫inn釜山中央店",
    6: "大邱水晶飯店", 7: "回溫暖的家 ✈️"
};

const guides = [
    {
        title: "海東龍宮寺",
        desc: "海東龍宮寺是韓國唯一一座座落於海邊的壯麗寺廟，始建於1376年。這裡依山傍海的景致與一般山中的佛寺截然不同，踏入寺廟前需經過108階的階梯，沿途可聽見浪花拍打礁岩的澎拜聲響。相傳在這裡誠心祈禱，至少能實現一個願望，因此終年香火鼎盛。清晨時分，更是釜山觀賞日出的絕佳地點，看著太陽從海平線升起，映照著古色古香的樓閣，景色美不勝收。",
        tag: "Heritage",
        icon: "fa-dharmachakra",
        img: "./img/海東龍宮寺.jpg"
    },
    {
        title: "釜山樂天世界",
        desc: "2022年全新開幕的釜山樂天世界冒險樂園，佔地廣大且充滿異國童話氛圍。園內最受歡迎的便是以「童話王國」為主題的建築設計，讓人彷彿置身於魔法世界中。除了有刺激感十足、時速高達105公里的水上雲霄飛車 Giant Splash，還有適合親子同樂的旋轉木馬與精彩的日間巡遊表演。這裡不僅是追求快感的年輕人天堂，多樣化的主題拍照區也絕對能滿足想要留下美照的旅人，是近期釜山最熱門的打卡地標。",
        tag: "Park",
        icon: "fa-fort-awesome",
        img: "./img/釜山樂天世界.jpg"
    },
    {
        title: "鑽石灣遊艇",
        desc: "搭乘鑽石灣豪華遊艇出海，是體驗釜山海洋魅力的最浪漫方式。從龍湖灣碼頭出發，航程將帶領遊客穿梭於廣安大橋之下，從海上的特等席近距離欣賞這座釜山地標的宏偉。若選擇在黃昏或夜晚時分登船，更能飽覽廣安里沿岸五光十色的城市夜景。微風徐徐吹過，手中握著香檳與三五好友交談，享受極致的奢華放鬆感，無論是情侶約會或家庭旅遊，這絕對是整趟賞櫻之旅中最難忘的高光時刻。",
        tag: "Ocean",
        icon: "fa-ship",
        img: "./img/鑽石灣遊艇.jpg"
    },
    {
        title: "Spa Land",
        desc: "位於世界最大百貨公司——新世界百貨內的 Spa Land，被譽為釜山最豪華的五星級汗蒸幕。這裡利用地下 1000 公尺處抽取的碳酸溫泉與食鹽溫泉，打造了多達 22 個溫泉浴池與 13 個各具特色主題的汗蒸房。從黃金桑拿室、芬蘭桑拿室到冰房一應俱全。內部空間挑高設計、充滿質感，除了泡湯區外還有高級躺椅休憩區與足湯池，是旅程中洗去疲憊、深度放鬆身心的極致享受，即便平時不習慣泡澡的人也會一試成主顧。",
        tag: "Relax",
        icon: "fa-bath",
        img: "./img/Spa Land.jpg"
    },
    {
        title: "白淺灘文化村",
        desc: "被譽為「釜山聖托里尼」的白淺灘文化村，原是韓戰時期難民的避風港，如今經過藝術家與居民的努力，轉型為充滿文藝氣息的小村落。沿著影島海岸線而築的層次感房舍，刷上純淨的藍白油漆，搭配腳下蔚藍的大海與遠處的絕影海岸步道，美得令人屏息。巷弄間隱藏著多間極具設計感的特色咖啡廳與手作工作坊，隨手一拍都是明信片般的風景。漫步在蜿蜒的海邊小徑，感受海風拂面與靜謐的氛圍，是體驗道地影島風情的最佳去處。",
        tag: "Photo",
        icon: "fa-camera-retro",
        img: "./img/白淺灘文化村.jpg"
    },
    {
        title: "鎮海櫻花",
        desc: "位於鎮海區的櫻花，是韓國春天最具代表性的風景，每年吸引數百萬人前來朝聖。最具盛名的莫過於長達 1.5 公里的「餘佐川櫻花徑」，橋上兩側櫻花盛開如隧道般覆蓋溪流；以及「慶和火車站」的櫻花鐵道，當火車緩緩駛進櫻花隧道，落櫻紛飛的瞬間簡直如同電影場景。鎮海市內隨處可見櫻花樹夾道盛開，形成一片壯觀的淡粉色花海。在這裡漫步於花樹之下，空氣中瀰漫著春天的清新氣息，是每年賞櫻季節絕對不能錯過的夢幻景點。",
        tag: "Season",
        icon: "fa-leaf",
        img: "./img/鎮海櫻花.jpg"
    },
    {
        title: "大邱近代胡同",
        desc: "大邱近代胡同是保留了韓國近現代史縮影的歷史之路。漫步在這些狹窄而悠長的小巷中，可以看見融合了西式與韓式風格的紅磚教堂、青蘿坡上的傳教士故居，以及著名的「三一運動階梯」。這裡不僅是多部熱門韓劇的取景地，更是感受南北韓歷史交織脈動的場域。沿途還有藥令市韓醫藥博物館等具有歷史意義的遺址，讓人彷彿穿越時空，走進上世紀的歷史長廊。在現代化的城市步調中，這裡保留了一份專屬於大邱的優雅與寧靜。",
        tag: "History",
        icon: "fa-landmark",
        img: "./img/大邱近代胡同.jpg"
    }
];

// --- CORE LOGIC ---
let currentDay = 1;
let fxRate = 46;

function changeFxRate() {
    const newRate = prompt("請輸入當前的韓元對台幣匯率 (例如 46 或 45.5):", fxRate);
    if (newRate !== null && !isNaN(newRate) && newRate > 0) {
        fxRate = parseFloat(newRate);
        localStorage.setItem('fxRate', fxRate);
        document.getElementById('fx-rate-display').innerText = `匯率 1 : ${fxRate}`;
        handleCalcInput();
    }
}

function getAutoDay() {
    const startDate = new Date('2026-03-29');
    const endDate = new Date('2026-04-04');
    const today = new Date();
    
    // 統一時間基準 (00:00:00) 以進行日期比較
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (today >= startDate && today <= endDate) {
        // 計算天數差 (+1 是因為從 Day 1 開始)
        return Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 1; // 不在範圍內則預設為第一天
}

function switchDay(day) {
    currentDay = day;
    document.getElementById('current-day-label').innerText = day;
    document.querySelectorAll('.day-btn').forEach((btn, idx) => {
        btn.classList.toggle('active-day', idx + 1 === day);
    });
    renderItinerary();
}

function renderItinerary() {
    const container = document.getElementById('itinerary-container');
    if (!container) return;
    container.innerHTML = '';

    itinerary[currentDay].forEach(item => {
        const div = document.createElement('div');
        div.className = `relative pl-12 timeline-line pb-6`;

        const dotClass = item.highlight ? 'bg-amber-500 ring-4 ring-amber-100' : (item.type === 'food' ? 'bg-emerald-500' : 'bg-sky-500');

        div.innerHTML = `
            <div class="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
                <div class="w-4 h-4 rounded-full ${dotClass} z-10"></div>
            </div>
            <div class="glass-card p-5 rounded-3xl transition-all active:scale-95">
                <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-slate-400 tracking-wider font-mono">${item.time}</span>
                    ${item.stay ? `<span class="text-[12px] bg-sky-50 px-3 py-1 rounded-full text-sky-600 font-bold">待 ${item.stay}</span>` : ''}
                </div>
                <h4 class="font-bold text-slate-800 text-xl">${item.text}</h4>
                <div class="flex gap-3 mt-4">
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
        `;
        container.appendChild(div);
    });
    document.getElementById('hotel-name').innerText = hotels[currentDay];
}

function renderGuides() {
    const container = document.getElementById('guide-container');
    if (!container) return;
    container.innerHTML = guides.map(g => `
        <div class="glass-card rounded-[2.5rem] p-0 shadow-sm relative overflow-hidden group mb-10">
            <!-- Image Area -->
            <div class="h-64 w-full overflow-hidden relative">
                <img src="${g.img}" alt="${g.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm z-10 flex items-center gap-2">
                    <i class="fas ${g.icon} text-sky-500 text-sm"></i>
                    <span class="text-[12px] font-extrabold text-sky-500 uppercase tracking-widest">${g.tag}</span>
                </div>
            </div>

            <!-- Content Area -->
            <div class="p-8">
                <h3 class="text-3xl font-black text-slate-800 mb-4">${g.title}</h3>
                <p class="text-base text-slate-500 leading-relaxed text-justify mb-4">
                    ${g.desc}
                </p>
            </div>
        </div>
    `).join('') + `<div class="h-10"></div>`; // 額外底部空間
}

function openMap(query) { window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank'); }
function openBlog(query) { window.open(`https://www.google.com/search?q=${encodeURIComponent(query + ' 食記')}`, '_blank'); }

// --- CALCULATOR LOGIC ---
function appendCalc(val) {
    const display = document.getElementById('calc-display');
    if (display.innerText === '0' && val !== '.') {
        display.innerText = val;
    } else {
        display.innerText += val;
    }
    handleCalcInput();
}

function clearCalc() {
    document.getElementById('calc-display').innerText = '0';
    updateTwdResult(0);
}

function handleCalcInput() {
    const input = document.getElementById('calc-display').innerText;
    const equalBtn = document.getElementById('calc-equal-btn');

    // 檢查是否有運算符號
    if (/[+\-*/]/.test(input)) {
        if (equalBtn) equalBtn.classList.remove('hidden');
        // 加法進行中時，台幣金額歸零避免誤會
        updateTwdResult(0);
    } else {
        if (equalBtn) equalBtn.classList.add('hidden');
        const val = parseFloat(input);
        if (!isNaN(val)) updateTwdResult(val);
        else if (input === '' || input === '0') updateTwdResult(0);
    }
}

function performManualCalc() {
    const display = document.getElementById('calc-display');
    const input = display.innerText;
    try {
        // 使用更安全的計算方式或簡單評估
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
    const twd = Math.round(krw / fxRate);
    document.getElementById('res-twd').innerText = twd.toLocaleString();
}

function resetCalculator() {
    document.getElementById('calc-display').innerText = '0';
    document.getElementById('res-twd').innerText = '0';
    document.getElementById('calc-equal-btn').classList.add('hidden');
}

// --- WEATHER LOGIC (Open-Meteo API - No Key Required & CORS Friendly) ---
async function fetchWeather() {
    const cities = [
        { name: 'Busan', displayName: '釜山', id: 'weather-busan', lat: 35.1796, lng: 129.0756 },
        { name: 'Daegu', displayName: '大邱', id: 'weather-daegu', lat: 35.8714, lng: 128.6014 }
    ];

    for (const city of cities) {
        try {
            // Open-Meteo 請求 URL，包含即時天氣與 7 日預報（我們取前 3 日）
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const data = await res.json();

            renderWeatherUI(city.id, data);

        } catch (e) {
            console.error(`Weather for ${city.name} failed`, e);
            document.getElementById(city.id).innerHTML = `
                <div class="text-white p-4 text-center">
                    <i class="fas fa-exclamation-triangle mb-2 opacity-50"></i>
                    <p class="text-xs opacity-70">氣象數據暫時無法取得</p>
                    <button onclick="fetchWeather()" class="mt-4 text-[10px] bg-white/20 px-3 py-1 rounded-full">重試</button>
                </div>
            `;
        }
    }
}

function renderWeatherUI(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const current = data.current_weather;
    const daily = data.daily;
    const temp = Math.round(current.temperature);
    const weatherCode = current.weathercode;
    const weatherDesc = getWmoWeatherDesc(weatherCode);

    // 取得今天的降雨機率 (daily.precipitation_probability_max[0])
    const rainChance = daily.precipitation_probability_max[0] || 0;
    const obsTime = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

    let html = `
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4 text-white gap-8">
                <span class="text-6xl font-black tracking-tighter shrink-0">${temp}°<sup class="text-3xl ml-1">C</sup></span>
                <div class="text-right min-w-0">
                     <span class="block text-xl font-bold mb-1">${weatherDesc}</span>
                     <span class="block text-sm font-medium opacity-90">降雨機率 ${rainChance}%</span>
                </div>
            </div>
            <div class="text-[12px] text-white/60 mb-2 font-medium">觀測時間：今天 ${obsTime}</div>
        </div>

        <div class="space-y-5 pt-6 border-t border-white/20">
            <span class="block text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-4">未來 3 日預報</span>
    `;

    // 渲染未來三天預報
    for (let i = 0; i < 3; i++) {
        const dateStr = daily.time[i].split('-').slice(1).join('/'); // MM/DD
        const code = daily.weathercode[i];
        const desc = getWmoWeatherDesc(code);
        const maxT = Math.round(daily.temperature_2m_max[i]);
        const minT = Math.round(daily.temperature_2m_min[i]);
        const prob = daily.precipitation_probability_max[i];

        html += `
            <div class="flex items-center justify-between text-white py-1">
                <span class="text-base font-black w-14">${dateStr}</span>
                <div class="flex items-center gap-3 flex-1 justify-center">
                    <i class="fas ${getWeatherIcon(code)} text-lg opacity-90"></i>
                    <span class="text-sm font-bold">${desc}</span>
                </div>
                <div class="text-base font-black text-right w-28">
                    <span>${minT}°</span> / <span>${maxT}°</span><sup class="text-[10px] ml-0.5">C</sup>
                    <span class="text-[11px] block opacity-70 font-bold mt-0.5 ml-1">☔ ${prob}%</span>
                </div>
            </div>
        `;
    }

    html += `</div>`;
    container.innerHTML = html;
}

function getWmoWeatherDesc(code) {
    const mapping = {
        0: '晴朗',
        1: '晴時多雲', 2: '多雲', 3: '陰天',
        45: '霧', 48: '霧',
        51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨',
        61: '小雨', 63: '雨', 65: '大雨',
        80: '陣雨', 81: '陣雨', 82: '強陣雨',
        95: '雷雨', 96: '雷雨伴有冰雹', 99: '雷雨伴有大冰雹'
    };
    return mapping[code] || '未知';
}

function getWeatherIcon(code) {
    if ([0, 1].includes(code)) return 'fa-sun';
    if ([2, 3].includes(code)) return 'fa-cloud-sun';
    if ([45, 48].includes(code)) return 'fa-smog';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'fa-cloud-showers-heavy';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'fa-snowflake';
    if ([95, 96, 99].includes(code)) return 'fa-bolt';
    return 'fa-cloud';
}

// --- INIT ---
window.onload = () => {
    // 優先讀取紀錄中的匯率
    const savedRate = localStorage.getItem('fxRate');
    if (savedRate) {
        fxRate = parseFloat(savedRate);
        const fxDisplay = document.getElementById('fx-rate-display');
        if (fxDisplay) fxDisplay.innerText = `匯率 1 : ${fxRate}`;
    }

    // 根據頁面容器執行對應初始化
    if (document.getElementById('itinerary-container')) {
        const autoDay = getAutoDay();
        renderItinerary();
        switchDay(autoDay);
    }
    
    if (document.getElementById('guide-container')) {
        renderGuides();
    }
    
    if (document.getElementById('weather-busan')) {
        fetchWeather();
    }
};
