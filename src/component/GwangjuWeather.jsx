import React, { useState, useEffect } from 'react';

const GwangjuWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 환경 변수에서 API 키 읽기
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

  useEffect(() => {
    // API URL 구성
    const GWANGJU_LAT = 128.1595;
    const GWANGJU_LON = 126.8526;
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${GWANGJU_LAT}&lon=${GWANGJU_LON}&appid=${API_KEY}&units=metric&lang=kr`;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      // API 키가 환경 변수에 설정되지 않은 경우
      if (!API_KEY) {
        setError('환경 변수에 OpenWeatherMap API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_OPENWEATHER_API_KEY를 추가해주세요.');
        setLoading(false);
        return;
      }
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(API_URL, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('API 키가 유효하지 않습니다. OpenWeatherMap에서 발급받은 올바른 API 키인지 확인해주세요.');
          } else if (response.status === 429) {
            throw new Error('API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
          } else {
            throw new Error(`API 오류: ${response.status} ${response.statusText}`);
          }
        }
        
        const data = await response.json();
        
        if (data && data.main && data.weather) {
          setWeatherData(data);
        } else {
          throw new Error('유효하지 않은 API 응답 구조');
        }
        
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요.');
        } else {
          console.error('OpenWeatherMap API 호출 실패:', err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [API_KEY]);

  const getWeatherInfo = () => {
    if (!weatherData) return null;
    
    return {
      temperature: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      description: weatherData.weather[0].description,
      windSpeed: weatherData.wind.speed,
      rainfall: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
      feelsLike: Math.round(weatherData.main.feels_like),
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : null
    };
  };

  const getWeatherIcon = (description) => {
    const iconMap = {
      '맑음': '☀️',
      '구름조금': '🌤️',
      '구름많음': '⛅',
      '흐림': '☁️',
      '비': '🌧️',
      '눈': '❄️',
      '천둥번개': '⛈️',
      '안개': '🌫️'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (description.includes(key)) return icon;
    }
    return '🌤️';
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '420px',
        margin: '20px auto',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        borderRadius: '20px',
        color: 'white',
        textAlign: 'center',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>🌤️</div>
        <div>날씨 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '420px',
        margin: '20px auto',
        padding: '30px 20px',
        background: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
        borderRadius: '20px',
        color: 'white',
        textAlign: 'center',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '15px' }}>⚠️</div>
        <div style={{ fontSize: '16px', lineHeight: '1.5' }}>{error}</div>
      </div>
    );
  }

  const weather = getWeatherInfo();
  
  return (
    <div style={{
      maxWidth: '420px',
      margin: '20px auto',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      borderRadius: '20px',
      color: 'white',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
      overflow: 'hidden'
    }}>
      {/* 헤더 섹션 */}
      <div style={{
        padding: '30px 25px 20px 25px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '28px', 
          fontWeight: '300',
          letterSpacing: '1px'
        }}>
          광주 날씨
        </h1>
        <div style={{ 
          fontSize: '16px', 
          opacity: '0.8',
          fontWeight: '300'
        }}>
          {new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </div>
      </div>

      {/* 메인 날씨 정보 */}
      {weather && (
        <div style={{ padding: '25px' }}>
          {/* 현재 온도와 날씨 아이콘 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ 
              fontSize: '72px', 
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {getWeatherIcon(weather.description)}
            </div>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: '100',
              marginBottom: '8px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {weather.temperature}°
            </div>
            <div style={{ 
              fontSize: '18px', 
              opacity: '0.9',
              fontWeight: '300',
              textTransform: 'capitalize'
            }}>
              {weather.description}
            </div>
            <div style={{ 
              fontSize: '14px', 
              opacity: '0.7',
              marginTop: '5px'
            }}>
              체감온도 {weather.feelsLike}°
            </div>
          </div>

          {/* 상세 정보 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginTop: '25px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '18px 15px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px' }}>습도</div>
              <div style={{ fontSize: '24px', fontWeight: '300' }}>💧 {weather.humidity}%</div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '18px 15px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px' }}>풍속</div>
              <div style={{ fontSize: '24px', fontWeight: '300' }}>💨 {weather.windSpeed}m/s</div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '18px 15px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px' }}>기압</div>
              <div style={{ fontSize: '20px', fontWeight: '300' }}>📊 {weather.pressure}hPa</div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '18px 15px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px' }}>가시거리</div>
              <div style={{ fontSize: '20px', fontWeight: '300' }}>
                👁️ {weather.visibility ? `${weather.visibility}km` : 'N/A'}
              </div>
            </div>
          </div>

          {/* 강수량 정보 (비가 올 때만 표시) */}
          {weather.rainfall > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '18px 15px',
              textAlign: 'center',
              marginTop: '15px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px' }}>시간당 강수량</div>
              <div style={{ fontSize: '24px', fontWeight: '300' }}>☔ {weather.rainfall}mm</div>
            </div>
          )}

          {/* 하단 정보 */}
          <div style={{
            textAlign: 'center',
            marginTop: '25px',
            fontSize: '12px',
            opacity: '0.6',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px'
          }}>
            <div>OpenWeatherMap 제공</div>
            <div style={{ marginTop: '5px' }}>
              마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GwangjuWeather;