import clogo from '../asset/c.svg';
import cpplogo from '../asset/cplusplus.svg';
import unitylogo from '../asset/unity.svg';
import reactlogo from '../asset/react.svg';
import javascriptlogo from '../asset/javascript.svg';

export default function Aboutlogo() {
    return (
        <div className='about-logo'>
            <img src={clogo} style={{backgroundColor: '#A8B9CC', width: '6vw', height: '6vw', border: '1px solid #A8B9CC'}}/>
            <img src={cpplogo} style={{backgroundColor: '#00599C', width: '6vw', height: '6vw', border: '1px solid #00599C'}}/>
            <img src={unitylogo} style={{backgroundColor: '#FFFFFF', width: '6vw', height: '6vw', border: '1px solid #FFFFFF'}}/>
            <img src={reactlogo} style={{backgroundColor: '#61DAFB', width: '6vw', height: '6vw', border: '1px solid #61DAFB'}}/>
            <img src={javascriptlogo} style={{backgroundColor: '#F7DF1E', width: '6vw', height: '6vw', border: '1px solid #F7DF1E'}}/>
        </div>
    );
}