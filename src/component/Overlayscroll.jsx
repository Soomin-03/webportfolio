import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../style/pageScroll.css';

const OverlayScroll = ({ firstPageContent, secondPageContent }) => {
    const firstPageRef = useRef(null);
    const secondPageRef = useRef(null);
    const [scrollOffset, setScrollOffset] = useState(0);

    // DOM 요소들의 높이를 측정하고 필요한 값을 계산하는 핵심 함수
    const measureAndCalculate = useCallback(() => {
        if (!firstPageRef.current || !secondPageRef.current) {
            // refs가 아직 null인 경우 (초기 렌더링 시), 기본 높이로 스크롤 가능 공간 설정
            // 실제 콘텐츠가 마운트되면 정확한 값으로 업데이트됩니다.
            const fallbackHeight = window.innerHeight * 2; // 최소한 뷰포트 2배 높이
            document.body.style.height = `${fallbackHeight}px`;
            document.documentElement.style.height = `${fallbackHeight}px`;
            return;
        }

        const firstPageHeight = firstPageRef.current.offsetHeight;
        const secondPageHeight = secondPageRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        // --- 스크롤 오프셋 (두 번째 페이지의 translateY 값) 계산 ---
        // 두 번째 페이지가 완전히 화면에 나타났을 때의 최대 scrollOffset
        // (두 번째 페이지의 바닥이 뷰포트의 바닥에 닿는 시점)
        // 예를 들어, 두 번째 페이지 높이가 1500px, 뷰포트가 800px이면
        // 700px만큼 translateUp 되어야 바닥이 보임.
        const maxPageScrollTranslation = Math.max(0, secondPageHeight - viewportHeight);

        // 현재 window.scrollY를 기반으로 두 번째 페이지의 translateY 값을 결정
        // 첫 번째 페이지 높이만큼 스크롤된 후부터 두 번째 페이지가 움직이기 시작합니다.
        let currentScrollY = window.scrollY;
        let newOffset = Math.max(0, currentScrollY - firstPageHeight); // 첫 페이지를 넘어서 스크롤된 양

        // 계산된 최대 오프셋(maxPageScrollTranslation)을 초과하지 않도록 제한
        newOffset = Math.min(newOffset, maxPageScrollTranslation);
        setScrollOffset(newOffset);


        // --- 문서 전체의 스크롤 가능한 높이 설정 ---
        // 브라우저의 스크롤바가 이 높이를 기반으로 생성됩니다.
        // = 첫 번째 페이지 높이 (고정된 부분) + 두 번째 페이지의 실제 콘텐츠 높이
        const totalDocumentScrollableHeight = firstPageHeight + secondPageHeight;

        // body 또는 html의 높이를 직접 설정하여 브라우저의 스크롤바를 제어합니다.
        // 이 방법이 가장 확실하게 전체 스크롤 길이를 제한합니다.
        document.body.style.height = `${totalDocumentScrollableHeight}px`;
        document.documentElement.style.height = `${totalDocumentScrollableHeight}px`;

        // 스크롤이 최대치를 넘어섰을 경우, 강제로 최대치로 스크롤 위치 조정
        // (사용자가 너무 빠르게 스크롤하여 JavaScript가 반영되기 전에 넘어설 경우 대비)
        const maxWindowScrollY = totalDocumentScrollableHeight - viewportHeight;
        if (currentScrollY > maxWindowScrollY) {
            window.scrollTo(0, maxWindowScrollY);
        }

    }, []); // 의존성 배열 비움: 이 함수 자체는 컴포넌트가 마운트될 때 한 번만 생성. 내부적으로 window.scrollY와 ref.current를 사용.

    useEffect(() => {
        // 컴포넌트 마운트 시 초기 측정 및 계산 수행
        measureAndCalculate();

        // 스크롤 및 리사이즈 이벤트 리스너 추가
        window.addEventListener('scroll', measureAndCalculate);
        window.addEventListener('resize', measureAndCalculate);

        // 컴포넌트 언마운트 시 이벤트 리스너 정리
        return () => {
            window.removeEventListener('scroll', measureAndCalculate);
            window.removeEventListener('resize', measureAndCalculate);
            // 정리 시 body/html 높이를 원래대로 되돌리거나 기본값으로 설정 (선택 사항)
            document.body.style.height = ''; // 스타일 초기화
            document.documentElement.style.height = ''; // 스타일 초기화
        };
    }, [measureAndCalculate]); // measureAndCalculate 함수가 변경될 때마다 useEffect 재실행 (주로 첫 마운트 시)

    return (
        <div className='container'>
            {/* 첫 번째 페이지 - 고정 */}
            <div
                ref={firstPageRef}
                className='firstPage'
            >
                {firstPageContent}
            </div>

            {/* 두 번째 페이지 - 첫 번째 페이지 위로 스크롤 */}
            <div
                ref={secondPageRef}
                className='secondPage'
                style={{
                    transform: `translateY(${-scrollOffset}px)`,
                    // 두 번째 페이지는 첫 번째 페이지가 끝나는 지점부터 시작합니다.
                    marginTop: firstPageRef.current ? firstPageRef.current.offsetHeight : '100vh',
                }}
            >
                {secondPageContent}
            </div>
            {/* 이전 버전의 scrollSpacer나 totalScrollableHeight를 위한 빈 div는 더 이상 필요 없음.
                body/html 높이로 전체 스크롤을 제어하기 때문. */}
        </div>
    );
};

export default OverlayScroll;