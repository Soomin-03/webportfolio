import React from 'react';
import Main from './page/mainPage.jsx';
import About from './page/aboutPage.jsx';
import OverlayScroll from './component/Overlayscroll.jsx';
import GwangjuWeather from './component/GwangjuWeather.jsx';

function App() {
  return (
    <div className="App">
      <OverlayScroll
        firstPageContent={<Main />}
        secondPageContent={<About />}
      />
    </div>
  );
}

export default App;
