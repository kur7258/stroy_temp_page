// 실시간 시간 업데이트
function updateTime() {
    const now = new Date();
    
    // 메인 헤더용 시간 (기존)
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul'
    };
    
    const timeString = now.toLocaleDateString('ko-KR', options);
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    // 사이드바 날짜 업데이트
    const currentDateElement = document.querySelector('.current-date');
    const currentTimeSmallElement = document.querySelector('.current-time-small');
    
    if (currentDateElement) {
        const dateOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'short',
            timeZone: 'Asia/Seoul'
        };
        
        const dateStr = now.toLocaleDateString('ko-KR', dateOptions);
        const [year, month, day] = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')];
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[now.getDay()];
        
        currentDateElement.textContent = `${year}.${month}.${day} (${weekday})`;
    }
    
    if (currentTimeSmallElement) {
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Seoul'
        };
        
        const timeStr = now.toLocaleTimeString('ko-KR', timeOptions);
        currentTimeSmallElement.textContent = timeStr;
    }
}

// 원형 진행률 애니메이션 (고정값)
function animateCircularProgress() {
    const circles = document.querySelectorAll('.circle-progress');
    const fixedValues = [75, 25, 90, 100, 10, 50]; // 각 카드별 고정값
    
    circles.forEach((circle, index) => {
        const percentage = fixedValues[index] || 0;
        const percentageElement = circle.querySelector('.percentage');
        
        // 애니메이션 딜레이 적용
        setTimeout(() => {
            animateProgress(circle, percentage, percentageElement);
        }, index * 200);
    });
}

// 개별 진행률 애니메이션
function animateProgress(circle, targetPercentage, percentageElement) {
    let currentPercentage = 0;
    const increment = targetPercentage / 60; // 60프레임으로 나누어 부드럽게
    
    const animation = setInterval(() => {
        currentPercentage += increment;
        
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(animation);
        }
        
        // 원형 진행률 업데이트
        const degree = (currentPercentage / 100) * 360;
        circle.style.background = `conic-gradient(
            #4a9eff ${degree}deg,
            #333 ${degree}deg
        )`;
        
        // 퍼센트 텍스트 업데이트
        percentageElement.textContent = `${Math.floor(currentPercentage)}%`;
    }, 16); // 약 60fps
}

// 통계 숫자 카운터 애니메이션 (고정값)
function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    // 각 카드별 고정값들
    const fixedValues = [
        [75, 100],    // 메인 홀: 현재 78명, 최대 120명
        [5, 20],      // VIP룸: 현재 9명, 최대 20명  
        [270, 300],     // 테라스: 현재 32명, 최대 40명
        [90, 90],     // 바 코너: 현재 23명, 최대 25명
        [50, 500],      // 대기실: 현재 5명, 최대 20명
        [50, 100]      // 프라이빗 다이닝: 현재 18명, 최대 30명
    ];
    
    let valueIndex = 0;
    statValues.forEach((element, index) => {
        const text = element.textContent;
        const isNumber = /^\d+/.test(text);
        
        if (isNumber) {
            const cardIndex = Math.floor(valueIndex / 2);
            const statIndex = valueIndex % 2;
            const targetValue = fixedValues[cardIndex] ? fixedValues[cardIndex][statIndex] : 0;
            const unit = text.replace(/^\d+/, ''); // 단위 추출 (명, 건, % 등)
            
            setTimeout(() => {
                animateCounter(element, targetValue, unit);
            }, index * 100);
            
            valueIndex++;
        }
    });
    
    // Takeout 카드의 큰 숫자도 고정값
    const largeNumber = document.querySelector('.large-number');
    if (largeNumber) {
        setTimeout(() => {
            animateCounter(largeNumber, 15, '건');
        }, 1000);
    }
}

// 개별 카운터 애니메이션
function animateCounter(element, targetValue, unit) {
    let currentValue = 0;
    const increment = targetValue / 30; // 30프레임으로 나누어 부드럽게
    
    const animation = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(animation);
        }
        
        element.textContent = `${Math.floor(currentValue)}${unit}`;
    }, 50);
}

// 네비게이션 활성화 처리
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // 모든 아이템에서 active 클래스 제거
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // 클릭된 아이템에 active 클래스 추가
            item.classList.add('active');
        });
    });
}

// 카드 호버 효과
function initCardEffects() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 방문 차트 그리기
function drawVisitChart() {
    const canvas = document.getElementById('visitChart');
    if (!canvas) {
        console.log('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Canvas 크기를 CSS 크기에 맞춰 설정
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, width, height);
    
    // 샘플 데이터 (시간별 방문자 수)
    const data = [2, 5, 8, 12, 15, 18, 22, 25, 20, 15, 10, 8];
    const maxValue = Math.max(...data);
    const padding = 10;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // 그라데이션 생성
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(74, 158, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(74, 158, 255, 0.1)');
    
    // 곡선 그리기 (채우기)
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    for (let i = 0; i < data.length; i++) {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + (1 - data[i] / maxValue) * chartHeight;
        
        if (i === 0) {
            ctx.lineTo(x, y);
        } else {
            const prevX = padding + ((i - 1) / (data.length - 1)) * chartWidth;
            const prevY = padding + (1 - data[i - 1] / maxValue) * chartHeight;
            const cpX = (prevX + x) / 2;
            
            ctx.quadraticCurveTo(cpX, prevY, x, y);
        }
    }
    
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 선 그리기
    ctx.beginPath();
    ctx.moveTo(padding, padding + (1 - data[0] / maxValue) * chartHeight);
    
    for (let i = 1; i < data.length; i++) {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + (1 - data[i] / maxValue) * chartHeight;
        const prevX = padding + ((i - 1) / (data.length - 1)) * chartWidth;
        const prevY = padding + (1 - data[i - 1] / maxValue) * chartHeight;
        const cpX = (prevX + x) / 2;
        
        ctx.quadraticCurveTo(cpX, prevY, x, y);
    }
    
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 데이터 포인트 그리기
    for (let i = 0; i < data.length; i++) {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + (1 - data[i] / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#4a9eff';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    console.log('Chart drawn successfully');
}

// 목표량 원형 그래프 애니메이션 (고정값)
function animateGoalProgress() {
    const circle = document.querySelector('.circle-progress-large');
    const percentage = document.querySelector('.goal-percentage');
    const currentValue = document.querySelector('.goal-current .goal-value');
    
    if (!circle || !percentage) {
        console.log('Goal progress elements not found');
        return;
    }
    
    const targetPercentage = 45; // 고정값 45%
    let currentPercentage = 0;
    const increment = targetPercentage / 60;
    
    // 초기 상태 설정
    circle.style.background = `conic-gradient(#4a9eff 0deg, #333 0deg)`;
    percentage.textContent = '0%';
    
    const animation = setInterval(() => {
        currentPercentage += increment;
        
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(animation);
        }
        
        const degree = (currentPercentage / 100) * 360;
        circle.style.background = `conic-gradient(
            #4a9eff ${degree}deg,
            #333 ${degree}deg
        )`;
        
        percentage.textContent = `${Math.floor(currentPercentage)}%`;
        
        // 현재 방문자 수도 업데이트 (고정값)
        if (currentValue) {
            const targetVisitors = 2880;
            const currentVisitors = Math.floor((currentPercentage / 100) * targetVisitors);
            currentValue.textContent = `${currentVisitors}명`;
        }
    }, 16);
    
    console.log('Goal progress animated with fixed values');
}

// 누적 막대 그래프 애니메이션
function animateStackedBar() {
    const segments = document.querySelectorAll('.bar-segment');
    
    if (segments.length === 0) {
        console.log('No stacked bar segments found');
        return;
    }
    
    segments.forEach((segment, index) => {
        const originalWidth = segment.style.width;
        
        // 초기 상태 설정
        segment.style.width = '0%';
        segment.style.transition = 'width 0.8s ease-out';
        
        setTimeout(() => {
            segment.style.width = originalWidth;
        }, index * 150);
    });
    
    console.log('Stacked bar animated');
}

// 식사시간 탭 기능
function initMealTabs() {
    const tabs = document.querySelectorAll('.meal-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 탭 변경에 따른 데이터 업데이트 시뮬레이션
            updateMealData(tab.textContent);
        });
    });
}

// 권역 선택 드롭다운 기능
function initZoneSelector() {
    const zoneSelect = document.getElementById('zoneSelect');
    
    if (zoneSelect) {
        zoneSelect.addEventListener('change', (e) => {
            const selectedZone = e.target.value;
            const selectedText = e.target.options[e.target.selectedIndex].text;
            
            console.log(`권역 변경: ${selectedText}`);
            updateZoneData(selectedZone, selectedText);
        });
    }
}

// 식사시간별 데이터 업데이트 (고정값)
function updateMealData(mealTime) {
    const countNumber = document.querySelector('.count-number');
    const mealTimeInfo = document.querySelector('.meal-time-info span');
    
    // 식사시간별 고정값
    const mealData = {
        '아침': 45,
        '점심': 78,
        '저녁': 62
    };
    
    if (countNumber) {
        const fixedCount = mealData[mealTime] || 78;
        countNumber.textContent = `${fixedCount}명`;
    }
    
    if (mealTimeInfo) {
        mealTimeInfo.textContent = `${mealTime}시간 점유율`;
    }
    
    // 차트는 다시 그리지 않음 (고정 화면)
    console.log(`${mealTime} 데이터로 변경됨`);
}

// 권역별 데이터 업데이트
function updateZoneData(zoneValue, zoneText) {
    const countNumber = document.querySelector('.count-number');
    const countLabel = document.querySelector('.count-label');
    
    // 권역별 고정 데이터
    const zoneData = {
        'zone1': {
            location: '10번가',
            count: 78
        },
        'zone2': {
            location: '강남역',
            count: 125
        },
        'zone3': {
            location: '홍대입구',
            count: 95
        }
    };
    
    const selectedData = zoneData[zoneValue] || zoneData['zone1'];
    
    if (countLabel) {
        countLabel.textContent = selectedData.location;
    }
    
    if (countNumber) {
        countNumber.textContent = `${selectedData.count}명`;
    }
    
    console.log(`${zoneText} 선택됨 - ${selectedData.location}: ${selectedData.count}명`);
}

// 퍼센트 카운터 애니메이션
function animatePercentageCounter(element, targetValue) {
    let currentValue = 0;
    const increment = targetValue / 30;
    
    const animation = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(animation);
        }
        
        element.textContent = `${Math.floor(currentValue)}%`;
    }, 50);
}

// 데이터 새로고침 시뮬레이션 (사용 안함)
function refreshData() {
    // 자동 새로고침 비활성화
    console.log('자동 새로고침 비활성화됨');
}

// 자동 새로고침 (비활성화)
function startAutoRefresh() {
    // 자동 새로고침 비활성화
    console.log('자동 새로고침 기능 비활성화됨');
}

// 키보드 단축키 (새로고침 비활성화)
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 식사시간 탭 단축키 (1-3)
        if (e.key >= '1' && e.key <= '3') {
            const tabs = document.querySelectorAll('.meal-tab');
            const index = parseInt(e.key) - 1;
            if (tabs[index]) {
                tabs.forEach(tab => tab.classList.remove('active'));
                tabs[index].classList.add('active');
                updateMealData(tabs[index].textContent);
            }
        }
        
        // 권역 선택 단축키 (Q, W, E)
        if (e.key.toLowerCase() === 'q') {
            const zoneSelect = document.getElementById('zoneSelect');
            if (zoneSelect) {
                zoneSelect.value = 'zone1';
                updateZoneData('zone1', '권역 1');
            }
        }
        if (e.key.toLowerCase() === 'w') {
            const zoneSelect = document.getElementById('zoneSelect');
            if (zoneSelect) {
                zoneSelect.value = 'zone2';
                updateZoneData('zone2', '권역 2');
            }
        }
        if (e.key.toLowerCase() === 'e') {
            const zoneSelect = document.getElementById('zoneSelect');
            if (zoneSelect) {
                zoneSelect.value = 'zone3';
                updateZoneData('zone3', '권역 3');
            }
        }
    });
}

// 반응형 처리
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    function updateLayout() {
        const width = window.innerWidth;
        
        if (width <= 600) {
            sidebar.style.width = '300px';
            if (mainContent.classList.contains('sidebar-open')) {
                mainContent.style.marginRight = '300px';
            }
        } else if (width <= 768) {
            sidebar.style.width = '350px';
            if (mainContent.classList.contains('sidebar-open')) {
                mainContent.style.marginRight = '350px';
            }
        } else {
            sidebar.style.width = '400px';
            if (mainContent.classList.contains('sidebar-open')) {
                mainContent.style.marginRight = '400px';
            }
        }
    }
    
    window.addEventListener('resize', updateLayout);
    updateLayout(); // 초기 실행
}

// 로딩 애니메이션
function showLoadingAnimation() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 사이트별 장비 데이터
const siteEquipmentData = {
    'healthy-lab': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '국탕 로봇1', status: 'success', desc: '정상', detail: '' },
        { name: '국탕 로봇2', status: 'success', desc: '정상', detail: '' },
        { name: '국탕 로봇3', status: 'success', desc: '정상', detail: '' },
        { name: '오토웍 로봇1', status: 'success', desc: '정상', detail: '' },
        { name: '오토웍 로봇2', status: 'warning', desc: '점검 필요', detail: '모터 과열' },
        { name: '튀김 로봇1', status: 'inactive', desc: '대기', detail: '대기' },
        { name: '튀김 로봇2', status: 'inactive', desc: '대기', detail: '대기' },
        { name: '컵 세척기1', status: 'error', desc: '오류', detail: '물 공급 이상' },
        { name: '컵 세척기2', status: 'error', desc: '오류', detail: '물 공급 이상' },
        { name: '야채 세척기1', status: 'error', desc: '오류', detail: '물체 끼임' },
        { name: '야채 세척기2', status: 'success', desc: '정상', detail: '' },
        { name: '식기 세척기', status: 'success', desc: '정상', detail: '' }
    ],
    'zero-lab-1': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '국탕 로봇1', status: 'success', desc: '정상', detail: '' },
        { name: '국탕 로봇2', status: 'success', desc: '정상', detail: '' },
        { name: '튀김 로봇', status: 'inactive', desc: '대기', detail: '' }
    ],
    'zero-lab-1-highlight': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '밥솥 로봇', status: 'success', desc: '정상', detail: '' },
        { name: '반찬 로봇', status: 'warning', desc: '점검 중', detail: '정기 점검' },
        { name: '세척 시스템', status: 'success', desc: '정상', detail: '' },
        { name: '포장 라인', status: 'success', desc: '정상', detail: '' }
    ],
    'zero-lab-2': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '조리 로봇A', status: 'success', desc: '정상', detail: '' },
        { name: '조리 로봇B', status: 'success', desc: '정상', detail: '' },
        { name: '냉장고', status: 'warning', desc: '온도 이상', detail: '수리 예정' },
        { name: '환기 시스템', status: 'success', desc: '정상', detail: '' }
    ],
    'zero-lab-2-b': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '면 조리기', status: 'success', desc: '정상', detail: '' },
        { name: '국물 가열기', status: 'success', desc: '정상', detail: '' },
        { name: '토핑 로봇', status: 'inactive', desc: '대기', detail: '' },
        { name: '주문 시스템', status: 'success', desc: '정상', detail: '' }
    ],
    'zero-lab-2-highlight': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '볶음 로봇', status: 'warning', desc: '과열', detail: '냉각 중' },
        { name: '야채 절단기', status: 'success', desc: '정상', detail: '' },
        { name: '포장 머신', status: 'success', desc: '정상', detail: '' },
        { name: '결제 시스템', status: 'error', desc: '통신 오류', detail: '재부팅 필요' }
    ],
    'zero-lab-3': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '스팀 쿠커', status: 'success', desc: '정상', detail: '' },
        { name: '그릴 로봇', status: 'success', desc: '정상', detail: '' },
        { name: '소스 디스펜서', status: 'warning', desc: '보충 필요', detail: '소스 부족' }
    ],
    'zero-lab-3-maintenance': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '전체 시스템', status: 'inactive', desc: '휴무', detail: '정기 점검 중' },
        { name: '보안 시스템', status: 'success', desc: '정상', detail: '감시 중' }
    ],
    'special-site': [
        { name: '장비 종류', status: 'header', desc: '상태', detail: '내용' },
        { name: '통합 서버', status: 'success', desc: '정상', detail: '' },
        { name: '네트워크 허브', status: 'success', desc: '정상', detail: '' },
        { name: '모니터링 시스템', status: 'warning', desc: '업데이트', detail: '시스템 업데이트 중' },
        { name: '백업 시스템', status: 'success', desc: '정상', detail: '' },
        { name: '알람 시스템', status: 'success', desc: '정상', detail: '' }
    ]
};

// 사이드바 토글
function toggleSidebar(show = true) {
    const sidebar = document.getElementById('equipmentSidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (show) {
        sidebar.classList.add('active');
        mainContent.classList.add('sidebar-open');
    } else {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
    }
}

// 장비 상태 표시
function showEquipmentStatus(siteId, siteName) {
    const equipmentData = siteEquipmentData[siteId] || [];
    const statusContainer = document.getElementById('equipmentStatus');
    const siteNameElement = document.getElementById('selectedSiteName');
    
    // 사이트 이름 업데이트
    siteNameElement.textContent = siteName;
    
    // 장비 상태 HTML 생성
    let statusHTML = '';
    
    equipmentData.forEach(equipment => {
        const statusClass = equipment.status === 'header' ? '' : 
                          equipment.status === 'success' ? 'success' :
                          equipment.status === 'error' ? 'error' :
                          equipment.status === 'warning' ? 'warning' : 'inactive';
        
        const dotClass = equipment.status === 'header' ? '' :
                        equipment.status === 'success' ? 'green' :
                        equipment.status === 'error' ? 'red' :
                        equipment.status === 'warning' ? 'orange' : 'gray';
        
        const statusSymbol = equipment.status === 'header' ? equipment.desc : '●';
        
        // 헤더인 경우 동그라미 없이 표시
        if (equipment.status === 'header') {
            statusHTML += `
                <div class="status-item header-item">
                    <div class="status-indicator">
                        <span class="status-label">${equipment.name}</span>
                    </div>
                    <span class="status-value ${statusClass}">${statusSymbol}</span>
                    <span class="status-desc">${equipment.detail}</span>
                </div>
            `;
        } else {
            statusHTML += `
                <div class="status-item">
                    <div class="status-indicator">
                        <div class="status-dot ${dotClass}"></div>
                        <span class="status-label">${equipment.name}</span>
                    </div>
                    <span class="status-value ${statusClass}">${statusSymbol}</span>
                    <span class="status-desc">${equipment.detail}</span>
                </div>
            `;
        }
    });
    
    statusContainer.innerHTML = statusHTML;
    
    // 사이드바 표시
    toggleSidebar(true);
}

// 장비 상태 분석
function analyzeEquipmentStatus(siteId, card) {
    // 휴무 상태 확인
    const statusElement = card.querySelector('.site-status');
    if (statusElement && statusElement.textContent.trim() === '휴무') {
        return 'maintenance';
    }
    
    // 숫자가 0으로 시작하는지 확인
    const statNumber = card.querySelector('.stat-number');
    if (statNumber) {
        const numberText = statNumber.textContent.trim();
        if (numberText.startsWith('0/')) {
            return 'normal'; // 0으로 시작하면 정상 상태
        }
    }
    
    const equipmentData = siteEquipmentData[siteId] || [];
    let hasError = false;
    let hasWarning = false;
    
    equipmentData.forEach(equipment => {
        if (equipment.status === 'error') {
            hasError = true;
        } else if (equipment.status === 'warning') {
            hasWarning = true;
        }
    });
    
    if (hasError) return 'error';
    if (hasWarning) return 'warning';
    return 'normal';
}

// 숫자 분할 및 색상 적용
function updateCardNumberDisplay(card, status) {
    const statNumber = card.querySelector('.stat-number');
    if (statNumber) {
        const numberText = statNumber.textContent;
        const parts = numberText.split('/');
        
        if (parts.length === 2) {
            statNumber.innerHTML = `<span class="stat-number-prefix">${parts[0]}</span><span class="stat-number-separator">/${parts[1]}</span>`;
        }
    }
}

// 카드 상태 업데이트
function updateCardStatus(card, siteId) {
    const status = analyzeEquipmentStatus(siteId, card);
    
    // 기존 상태 클래스 제거
    card.classList.remove('status-normal', 'status-warning', 'status-error', 'status-maintenance');
    
    // 새 상태 클래스 추가
    card.classList.add(`status-${status}`);
    
    // 숫자 색상 업데이트
    updateCardNumberDisplay(card, status);
}

// 모든 카드 상태 초기화
function initCardStatuses() {
    const siteCards = document.querySelectorAll('.site-card');
    
    siteCards.forEach(card => {
        const siteId = card.getAttribute('data-site');
        if (siteId) {
            updateCardStatus(card, siteId);
        }
    });
}

// 사이트 카드 클릭 이벤트 초기화
function initSiteCardEvents() {
    const siteCards = document.querySelectorAll('.site-card');
    
    siteCards.forEach(card => {
        card.addEventListener('click', () => {
            const siteId = card.getAttribute('data-site');
            const siteName = card.getAttribute('data-site-name');
            
            // 모든 카드에서 selected 클래스 제거
            siteCards.forEach(c => c.classList.remove('selected'));
            // 현재 카드에 selected 클래스 추가
            card.classList.add('selected');
            
            // 장비 상태 표시
            showEquipmentStatus(siteId, siteName);
        });
    });
}

// 사이드바 닫기 이벤트
function initSidebarClose() {
    const closeButton = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('equipmentSidebar');
    
    closeButton.addEventListener('click', () => {
        toggleSidebar(false);
        
        // 선택된 카드 해제
        document.querySelectorAll('.site-card').forEach(card => {
            card.classList.remove('selected');
        });
    });
    
    // ESC 키로 사이드바 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar(false);
            document.querySelectorAll('.site-card').forEach(card => {
                card.classList.remove('selected');
            });
        }
    });
}

// 초기화 함수
function init() {
    console.log('로봇 자동화 관제 대시보드 초기화 중...');
    
    // 시간 업데이트 시작
    updateTime();
    setInterval(updateTime, 1000);
    
    // 각종 기능 초기화
    initCardStatuses();  // 카드 상태 초기화 추가
    initSiteCardEvents();
    initSidebarClose();
    handleResize();
    
    console.log('로봇 자동화 관제 대시보드 초기화 완료');
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', init);

// 페이지 가시성 변경 처리 (비활성화)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // 고정 화면 모드에서는 새로고침하지 않음
        console.log('페이지가 다시 보여짐 (새로고침 안함)');
    }
});

// 에러 핸들링
window.addEventListener('error', (e) => {
    console.error('대시보드 오류:', e.error);
});

// 개발자 도구용 유틸리티 함수들
window.dashboardUtils = {
    refreshData,
    animateCircularProgress,
    animateCounters,
    drawVisitChart,
    animateGoalProgress,
    animateStackedBar,
    updateTime
};
