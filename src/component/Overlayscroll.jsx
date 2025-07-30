import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../style/pageScroll.css';

const OverlayScroll = ({ firstPageContent, secondPageContent}) => {
    const firstPageRef = useRef(null);
    const secondPageRef = useRef(null);
    const [scrollOffset, setScrollOffset] = useState(0);

    const measureAndCalculate = useCallback(() => {
        if (!firstPageRef.current || !secondPageRef.current) {
            // 초기 렌더링 시 refs가 null일 경우, 임시 스크롤 공간 설정
            const fallbackHeight = window.innerHeight * 2;
            document.body.style.height = `${fallbackHeight}px`;
            document.documentElement.style.height = `${fallbackHeight}px`;
            return;
        }

        const firstPageHeight = firstPageRef.current.offsetHeight;
        const secondPageHeight = secondPageRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        // --- 스크롤 오프셋 (두 번째 페이지의 translateY 값) 계산 ---
        // 두 번째 페이지가 첫 번째 페이지를 완전히 덮고 뷰포트 상단에 고정되는 시점을 기준으로 합니다.
        // 즉, secondPage가 firstPage의 높이만큼 위로 올라와야 합니다.
        const translationNeededToCoverFirstPage = firstPageHeight - viewportHeight;

        // 현재 스크롤 위치 (window.scrollY)를 가져옵니다.
        let currentScrollY = window.scrollY;

        // `newOffset`은 secondPage가 위로 이동할 거리입니다.
        // 스크롤이 시작되면 (currentScrollY > 0) secondPage가 움직이기 시작합니다.
        // firstPageHeight만큼 스크롤되면 secondPage는 firstPage를 완전히 덮습니다.
        let newOffset = Math.max(0, currentScrollY);
        newOffset = Math.min(newOffset, translationNeededToCoverFirstPage); // 첫 페이지를 덮는 만큼만 이동

        setScrollOffset(newOffset);


        // --- 문서 전체의 스크롤 가능한 높이 설정 ---
        // 이 부분이 가장 중요합니다. 브라우저 스크롤바의 총 길이를 결정합니다.
        // 1. firstPage를 덮는 데 필요한 스크롤 공간: firstPageHeight
        // 2. secondPage의 '고유' 콘텐츠를 스크롤하는 데 필요한 추가 공간: secondPageHeight - viewportHeight
        //    (secondPage의 콘텐츠가 뷰포트보다 짧으면 0)
        // 3. 뷰포트 높이 (최소한 뷰포트 1개는 항상 스크롤 가능해야 함)

        // firstPageHeight만큼 스크롤하면 secondPage가 firstPage를 완전히 덮고 뷰포트 상단에 고정됩니다.
        // 그 후, secondPage의 내용이 뷰포트보다 길 경우 스크롤이 가능해야 합니다.
        const scrollableContentInsideSecondPage = Math.max(0, viewportHeight - secondPageContent);

        // 총 스크롤 높이 = (첫 페이지 덮는 스크롤 구간) + (두 번째 페이지 내부 스크롤 구간) + (뷰포트 높이)
        // (첫 페이지 덮는 스크롤 구간) = firstPageHeight (secondPage가 firstPage만큼 이동해야 하므로)
        // (두 번째 페이지 내부 스크롤 구간) = secondPageHeight - viewportHeight (secondPage가 고정된 후 콘텐츠 스크롤)
        // (뷰포트 높이) = 뷰포트의 가장 아래까지 스크롤 할 수 있는 공간
        const totalDocumentScrollableHeight = firstPageHeight + scrollableContentInsideSecondPage + viewportHeight;


        document.body.style.height = `${totalDocumentScrollableHeight}px`;
        document.documentElement.style.height = `${totalDocumentScrollableHeight}px`;

        // 스크롤이 최대치를 넘어섰을 경우, 강제로 최대치로 스크롤 위치 조정 (안전 장치)
        const maxWindowScrollY = totalDocumentScrollableHeight - viewportHeight;
        if (currentScrollY > maxWindowScrollY) {
            window.scrollTo(0, maxWindowScrollY);
        }

    }, []);

    useEffect(() => {
        measureAndCalculate();

        window.addEventListener('scroll', measureAndCalculate);
        window.addEventListener('resize', measureAndCalculate);

        return () => {
            window.removeEventListener('scroll', measureAndCalculate);
            window.removeEventListener('resize', measureAndCalculate);
            document.body.style.height = '';
            document.documentElement.style.height = '';
        };
    }, [measureAndCalculate]);

    return (
        <div className='container'>
            {/* 첫 번째 페이지 - 고정될 배경 역할 */}
            <div
                ref={firstPageRef}
                className='firstPage'
            >
                {firstPageContent}
            </div>

            {/* 두 번째 페이지 - 첫 번째 페이지 위로 스크롤하여 덮음 */}
            <div
                ref={secondPageRef}
                className='secondPage'
                style={{
                    // scrollOffset이 0에서 firstPageHeight까지 증가하며 두 번째 페이지를 위로 올립니다.
                    transform: `translateY(${-scrollOffset}px)`,
                    // secondPage의 초기 위치를 firstPage 바로 아래로 설정합니다.
                    // 이렇게 해야 스크롤 시작 시 firstPage 뒤에서 올라오는 것처럼 보입니다.
                    marginTop: firstPageRef.current ? firstPageRef.current.offsetHeight : '100vh',
                }}
            >
                {secondPageContent}
            </div>
        </div>
    );
};

export default OverlayScroll;