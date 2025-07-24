import clogo from '../asset/c.svg';
import cpplogo from '../asset/cplusplus.svg';
import unitylogo from '../asset/unity.svg';

export default function Mainlogo() {
    return (
        <div className='main-logo'>
            <img src={clogo} className="tech-logo"/>
            <img src={cpplogo} className="tech-logo"/>
            <img src={unitylogo} className="tech-logo"/>
        </div>
    );
}