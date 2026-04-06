// 這裡是所有行程的註冊表
export const trips = [
    {
        id: '2026_busan',
        name: '2026釜山海岸賞櫻之旅',
        startDate: '2026-03-29',
        endDate: '2026-04-04',
        coverImg: './img/鎮海櫻花.jpg',
        primaryColor: '#0077B6', // 海岸藍
        secondaryColor: '#90E0EF',
        accentColor: '#FFB7C5',   // 櫻花粉
        currency: 'KRW',         // 目標幣別
        icon: 'fa-ship',         // 主題圖示 (FontAwesome class)
        flights: [
            { type: 'dep', label: '去程 3/29 · 濟州航空 7C6164', time: '02:50 TPE → 06:10 PUS' },
            { type: 'arr', label: '回程 4/4 · 德威航空 TW663', time: '22:50 TAE → 00:25 TPE' }
        ]
    },
    {
        id: '2025_kyoto',
        name: '2025京都賞楓之旅',
        startDate: '2025-12-04',
        endDate: '2025-12-09',
        coverImg: './img/京都.jpg',
        pdfUrl: './pdf/2025京都、大阪旅遊手冊.pdf'
    }
    {
        id: '2025_kyoto',
        name: '2025首爾賞櫻之旅',
        startDate: '2025-04-04',
        endDate: '2025-04-09',
        coverImg: './img/首爾櫻花.jpg',
        pdfUrl: './pdf/2025首爾旅遊手冊.pdf'
    }
];

export function getCurrentTripId() {
    return localStorage.getItem('currentTripId');
}

export function setCurrentTripId(id) {
    localStorage.setItem('currentTripId', id);
}
