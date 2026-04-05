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
    }
];

export function getCurrentTripId() {
    return localStorage.getItem('currentTripId') || '2026_busan';
}

export function setCurrentTripId(id) {
    localStorage.setItem('currentTripId', id);
}
