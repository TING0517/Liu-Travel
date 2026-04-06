# Liu-Travel App 維護與更新指南

👉 **App 網頁版連結 (可安裝 PWA)**: [https://TING0517.github.io/Liu-Travel/](https://TING0517.github.io/Liu-Travel/)

這份指南將會教你：當你準備要出發去**下一趟新的旅程**時，該如何無痛切換 App，並且完美地把舊旅程存進「歷史旅程」中！

---

## 🚀 情境一：我想新增一趟全新旅程（並設為當前主要旅程）

系統的設計非常聰明且全自動，**只要把新行程塞到設定檔的最上面，它就會變成目前 App 的主角**！

### 步驟教學：
1. 打開 `data/config.js` 檔案。
2. 找到最上方的 `trips = [` 陣列。
3. 在陣列的**最前面（也就是原釜山行程的上方）**，直接貼上你的新行程設定碼：

```javascript
export const trips = [
    // 👇 把新的行程塞在最前面！
    {
        id: '2028_hawaii',         // 👈 必填：給它一個獨特且不要重複的英文/數字 ID
        name: '2028夏威夷度假',
        startDate: '2028-06-10',
        endDate: '2028-06-18',
        coverImg: './img/hawaii.jpg', // 👈 記得去 img 資料夾放一張封面圖
        
        // --- 外觀與顏色設定 ---
        primaryColor: '#F4BA1F',  
        secondaryColor: '#FFD166',
        accentColor: '#EF476F',   
        icon: 'fa-umbrella-beach',
        
        // --- 記帳與匯率設定 ---
        currency: 'USD',          // 目標幣別
        fxRate: 32,               // 結算匯率
        fxOperator: 'multiply',   // 美金算台幣要用「乘法」(multiply)，如果是韓元則是「除法」(divide)
        
        // --- 班機設定 ---
        flights: [
            { type: 'dep', label: '去程 6/10 · 華航 CI002', time: '23:30 TPE → 14:15 HNL' },
            { type: 'arr', label: '回程 6/18 · 華航 CI001', time: '16:15 HNL → 21:30 TPE' }
        ]
    },
    // 👇 原本的釜山行程不用動，讓系統把它往下拉就好
    {
        id: '2026_busan',
        name: '2026釜山海岸賞櫻之旅',
        // ...後面省略...
    }
];
```

### 發生了什麼事？
*   **首頁與記帳頁面** (`index.html`, `ledger.html`) 永遠會自動抓取**清單裡的第一個行程**當作主角！所以只要把夏威夷放第一個，原本的計算機、行程表、花費紀錄就會自動變成夏威夷的內容，且 Firebase 資料庫會自動建立 `2028_hawaii_itineraries` 安全地存放最新資料。
*   **釜山去哪了？** 因為釜山被擠到了清單的第二個位置，它就會自動被視為**「歷史行程」**，你隨時可以點擊底下的「歷史旅程」進去回味它！

---

## 📚 情境二：我想新增一趟單純的「PDF 歷史檔案」

如果你不是要去玩，只是想把好幾年前（用 PDF 做的手冊）丟進歷史區域做紀念。

### 步驟教學：
1. 一樣打開 `data/config.js` 檔案。
2. 往下滑，找到陣列的**尾端（最下面）**。
3. 依照現有的格式，補上簡易版的設定，**並附上 `pdfUrl` 就能觸發 PDF 觀看模式**：

```javascript
    // ...前面是釜山、京都等行程...
    {
        id: '2019_tokyo',
        name: '2019東京初體驗',
        startDate: '2019-10-01',
        endDate: '2019-10-05',
        coverImg: './img/tokyo.jpg',     // 封面圖
        pdfUrl: './pdf/2019東京手冊.pdf'   // 👈 放上相應的 PDF 檔案路徑
    }
]; // 陣列結束
```
4. 如果你要新增，記得去你的專案資料夾裡的 `pdf/` 和 `img/` 把實體檔案丟進去！

---

## 🛠️ 情境三：如何解除「沒有目前旅程」的佔位模式並恢復正常功能？

如果你之前因為暫時沒有行程，把 `index.html`、`ledger.html` 和 `weather.html` 變成「沒有目前旅程」的佔位首頁，當你準備好要出發新旅程時，請按照以下步驟**還原程式碼**：

### 步驟教學：
1. **打開 `index.html`、`ledger.html` 與 `weather.html`**。
2. 尋找畫面中央大大的 **佔位顯示區塊**，並把它整段「刪除」或「註解掉」：
   ```html
   <!-- 類似這個區域：無行程佔位顯示 -->
   <main class="flex flex-col items-center justify-center min-h-[100vh]...">
      ...目前沒有進行中的旅程...
   </main>
   ```
3. 接下來，尋找檔案裡面所有帶有 `(暫時註解)` 字樣的標籤，把它們外層的 `<!--` 跟 `-->` 刪掉，讓程式碼恢復運作！你通常會找到這四個被註解的地方：
   * `<!-- Loading Overlay (暫時註解) -->`
   * `<!-- Header (暫時註解) -->`
   * `<!-- Main Content Area / Expense List Page (暫時註解) -->`
   * `<!-- Scripts (暫時註解) -->`（這一步最重要，包含 `<script type="module" src="..."></script>`）
4. 全都解除註解並存檔後，新旅程（在 `config.js` 裡排第 1 個的那個）就會完美且正式地渲染出來了！

---

## 🌤️ 情境四：如何設定新旅程的「天氣預報」地區？

如果你從釜山去到了夏威夷，你需要去跟系統說：請幫我抓取夏威夷的天氣！這只需修改兩個小地方：

### 步驟教學：
1. **設定經緯度 (`weather.js`)**
   打開 `weather.js`，尋找最上方的 `cities` 陣列：
   ```javascript
   const cities = [
       // 把經緯度 (lat, lng) 換成新地點在 Google Map 上的經緯度
       // 把 id 取一個新的名字，例如 weather-hawaii
       { name: 'Hawaii', displayName: '夏威夷', id: 'weather-hawaii', lat: 21.3069, lng: -157.8583 }
   ];
   ```
2. **綁定畫面 (`weather.html`)**
   打開（解除註解後的）`weather.html`，往下找會找到類似這樣的區塊：
   ```html
   <h2 class="text-xl font-black text-slate-800 mb-6">釜山 Busan</h2>
   <!-- 把 id 替換成你在 js 裡面設定的 id -->
   <div id="weather-busan" class="glass-card p-6..."></div> 
   ```
   把標題改成「夏威夷」，然後讓 `div` 的 `id` 變成 `weather-hawaii`，天氣資料就會精準送達囉！

---

## 🔄 最後的溫馨提醒 (版本快取 Cache)

每次你對 App 動了手腳（包含加上最新的圖片、改變 `config.js` 裡面的行程），因為我們把這支程式做成了超專業的 PWA (可以離線運作），所以**你一定要去修改 `sw.js` 裡的第一行程式碼，把版本號往上+1**：

```javascript
// 編輯 sw.js 裡面的這行
const CACHE_NAME = 'travel-vX.X'; // 就像手機 App 更新要換版本號一樣，強迫手機重新下載最新版！
```

以上！有了這份指南，即使過了一兩年你也能輕鬆地讓 App 一代傳承下去！
