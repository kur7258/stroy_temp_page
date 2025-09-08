// 실시간 시간 업데이트
function updateTime() {
    const now = new Date();
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
}

// 설비 상세 데이터
const equipmentData = {
    '컵세척기1': {
        name: '컵세척기1',
        status: 'normal',
        statusText: '정상',
        location: '주방 구역 A',
        operationTime: '8시간 30분',
        lastMaintenance: '2025.09.01',
        temperature: '65°C',
        details: [
            { label: '위치', value: '주방 구역 A' },
            { label: '가동시간', value: '8시간 30분' },
            { label: '온도', value: '65°C' },
            { label: '마지막 점검', value: '2025.09.01' }
        ]
    },
    '국탕로봇1': {
        name: '국탕로봇1',
        status: 'warning',
        statusText: '02, 모터 과열',
        location: '조리 구역 B',
        operationTime: '3시간 45분',
        lastMaintenance: '2025.08.28',
        temperature: '85°C',
        details: [
            { label: '위치', value: '조리 구역 B' },
            { label: '현재 작업', value: '나물볶음' },
            { label: '가동시간', value: '3시간 45분' },
            { label: '온도', value: '85°C' },
            { label: '예상 완료', value: '15분 후' }
        ]
    },
    '컵세척기2': {
        name: '컵세척기2',
        status: 'warning',
        statusText: '03, 브러시 미정축',
        location: '주방 구역 C',
        operationTime: '6시간 12분',
        lastMaintenance: '2025.08.25',
        temperature: '62°C',
        errorCode: 'W-03',
        errorDesc: '브러시 미정축 - 점검 필요',
        details: [
            { label: '위치', value: '주방 구역 C' },
            { label: '가동시간', value: '6시간 12분' },
            { label: '온도', value: '62°C' },
            { label: '경고 코드', value: 'W-03' },
            { label: '경고 내용', value: '브러시 미정축' },
            { label: '권장 조치', value: '브러시 정축 점검' },
            { label: '마지막 점검', value: '2025.08.25' }
        ]
    },
    '오토웍1': {
        name: '오토웍1',
        status: 'normal',
        statusText: '정상, 삼겹살',
        location: '조리 구역 D',
        operationTime: '2시간 15분',
        lastMaintenance: '2025.09.05',
        temperature: '78°C',
        details: [
            { label: '위치', value: '조리 구역 D' },
            { label: '현재 작업', value: '나물볶음' },
            { label: '가동시간', value: '2시간 15분' },
            { label: '온도', value: '78°C' },
            { label: '마지막 점검', value: '2025.09.05' },
            { label: '예상 완료', value: '25분 후' }
        ]
    },
    '오토웍2': {
        name: '오토웍2',
        status: 'normal',
        statusText: '정상, 삼겹살',
        location: '조리 구역 E',
        operationTime: '3시간 45분',
        lastMaintenance: '2025.09.03',
        temperature: '75°C',
        details: [
            { label: '위치', value: '조리 구역 E' },
            { label: '현재 작업', value: '나물볶음' },
            { label: '가동시간', value: '3시간 45분' },
            { label: '온도', value: '75°C' },
            { label: '마지막 점검', value: '2025.09.03' },
            { label: '예상 완료', value: '15분 후' }
        ]
    },
    '국탕로봇2': {
        name: '국탕로봇2',
        status: 'warning',
        statusText: '02, 모터 과열',
        location: '조리 구역 F',
        operationTime: '3시간 45분',
        lastMaintenance: '2025.08.30',
        temperature: '82°C',
        details: [
            { label: '위치', value: '조리 구역 F' },
            { label: '현재 작업', value: '나물볶음' },
            { label: '가동시간', value: '3시간 45분' },
            { label: '온도', value: '82°C' },
            { label: '마지막 점검', value: '2025.08.30' },
            { label: '예상 완료', value: '15분 후' }
        ]
    }
};

// 툴팁 관련 함수
function showTooltip(event, equipment, status, detail) {
    const tooltip = document.getElementById('tooltip');
    const tooltipTitle = tooltip.querySelector('.tooltip-title');
    const tooltipStatus = tooltip.querySelector('.tooltip-status');
    const tooltipDetail = tooltip.querySelector('.tooltip-detail');
    
    tooltipTitle.textContent = equipment;
    tooltipStatus.textContent = status;
    tooltipDetail.textContent = detail || '';
    
    tooltip.classList.add('show');
    
    // 툴팁 위치 조정
    const rect = tooltip.getBoundingClientRect();
    const x = event.pageX + 10;
    const y = event.pageY - rect.height - 10;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('show');
}

function moveTooltip(event) {
    const tooltip = document.getElementById('tooltip');
    if (tooltip.classList.contains('show')) {
        const rect = tooltip.getBoundingClientRect();
        const x = event.pageX + 10;
        const y = event.pageY - rect.height - 10;
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }
}

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

// 설비 상세 정보 표시
function showEquipmentDetails(equipmentName) {
    const equipment = equipmentData[equipmentName];
    if (!equipment) return;
    
    const sidebar = document.getElementById('equipmentSidebar');
    const selectedName = document.getElementById('selectedEquipmentName');
    const noSelection = sidebar.querySelector('.no-selection');
    const equipmentDetails = document.getElementById('equipmentDetails');
    
    // 사이드바 제목 업데이트
    selectedName.textContent = `${equipment.name} - ${equipment.statusText}`;
    
    // 선택 안내 숨기기, 상세 정보 보이기
    noSelection.style.display = 'none';
    equipmentDetails.style.display = 'flex';
    
    // 상세 정보 HTML 생성
    let detailsHTML = '';
    equipment.details.forEach(detail => {
        let valueClass = '';
        if (detail.label.includes('코드') || detail.label.includes('경고') || detail.label.includes('에러')) {
            valueClass = equipment.status === 'error' ? 'error' : 'warning';
        }
        
        detailsHTML += `
            <div class="detail-item">
                <span class="detail-label">${detail.label}</span>
                <span class="detail-value ${valueClass}">${detail.value}</span>
            </div>
        `;
    });
    
    equipmentDetails.innerHTML = detailsHTML;
    
    // 사이드바 표시
    toggleSidebar(true);
}

// 설비 마커 이벤트 초기화
function initEquipmentMarkers() {
    const markers = document.querySelectorAll('.equipment-marker');
    
    markers.forEach(marker => {
        const equipment = marker.getAttribute('data-equipment');
        const status = marker.getAttribute('data-status');
        const detail = marker.getAttribute('data-detail');
        
        // 마우스 호버 이벤트
        marker.addEventListener('mouseenter', (e) => {
            showTooltip(e, equipment, status, detail);
        });
        
        marker.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        marker.addEventListener('mousemove', (e) => {
            moveTooltip(e);
        });
        
        // 클릭 이벤트
        marker.addEventListener('click', () => {
            // 모든 마커에서 selected 클래스 제거
            markers.forEach(m => m.classList.remove('selected'));
            // 현재 마커에 selected 클래스 추가
            marker.classList.add('selected');
            
            // 상세 정보 표시
            showEquipmentDetails(equipment);
            
            // 툴팁 숨기기
            hideTooltip();
        });
    });
}

// 사이드바 닫기 이벤트
function initSidebarClose() {
    const closeButton = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('equipmentSidebar');
    
    closeButton.addEventListener('click', () => {
        toggleSidebar(false);
        
        // 선택된 마커 해제
        document.querySelectorAll('.equipment-marker').forEach(marker => {
            marker.classList.remove('selected');
        });
        
        // 상세 정보 숨기기, 선택 안내 보이기
        const noSelection = sidebar.querySelector('.no-selection');
        const equipmentDetails = document.getElementById('equipmentDetails');
        noSelection.style.display = 'block';
        equipmentDetails.style.display = 'none';
    });
    
    // ESC 키로 사이드바 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar(false);
            document.querySelectorAll('.equipment-marker').forEach(marker => {
                marker.classList.remove('selected');
            });
            
            const noSelection = sidebar.querySelector('.no-selection');
            const equipmentDetails = document.getElementById('equipmentDetails');
            noSelection.style.display = 'block';
            equipmentDetails.style.display = 'none';
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

// CSS 스타일 동적 추가 (선택된 마커 스타일)
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .equipment-marker.selected .marker-dot {
            transform: scale(1.4);
            box-shadow: 0 0 0 8px rgba(74, 158, 255, 0.4);
            border-color: #4a9eff;
            border-width: 6px;
        }
        
        .detail-value.error {
            color: #ff6b6b;
        }
        
        .detail-value.warning {
            color: #ff9500;
        }
    `;
    document.head.appendChild(style);
}

// 초기화 함수
function init() {
    console.log('도면 기반 설비 모니터링 초기화 중...');
    
    // 시간 업데이트 시작
    updateTime();
    setInterval(updateTime, 1000);
    
    // 각종 기능 초기화
    addDynamicStyles();
    initEquipmentMarkers();
    initSidebarClose();
    handleResize();
    
    console.log('도면 기반 설비 모니터링 초기화 완료');
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', init);

// 에러 핸들링
window.addEventListener('error', (e) => {
    console.error('도면 페이지 오류:', e.error);
});

// 개발자 도구용 유틸리티 함수들
window.floorplanUtils = {
    showEquipmentDetails,
    toggleSidebar,
    updateTime,
    equipmentData
};
