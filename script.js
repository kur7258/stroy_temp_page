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
            sidebar.style.width = '60px';
            mainContent.style.marginLeft = '60px';
        } else if (width <= 768) {
            sidebar.style.width = '350px';
            mainContent.style.marginLeft = '350px';
        } else {
            sidebar.style.width = '400px';
            mainContent.style.marginLeft = '400px';
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

// 초기화 함수
function init() {
    console.log('대시보드 초기화 중... (고정 화면 모드)');
    
    // 시간 업데이트 시작
    updateTime();
    setInterval(updateTime, 1000);
    
    // 각종 기능 초기화
    initCardEffects();
    initKeyboardShortcuts();
    initMealTabs();
    initZoneSelector();
    handleResize();
    
    // 로딩 애니메이션 후 데이터 로드
    showLoadingAnimation();
    
    // 차트 그리기를 위해 약간의 지연 후 실행 (한 번만)
    setTimeout(() => {
        console.log('Drawing initial chart with fixed data...');
        drawVisitChart();
        animateGoalProgress();
        animateStackedBar();
        animateCircularProgress();
        animateCounters();
        
        // 자동 새로고침 제거됨
        console.log('고정 화면 모드로 설정 완료');
    }, 500);
    
    // 윈도우 리사이즈 시 차트 다시 그리기
    window.addEventListener('resize', () => {
        setTimeout(drawVisitChart, 100);
    });
    
    console.log('대시보드 초기화 완료 (고정 모드)');
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
