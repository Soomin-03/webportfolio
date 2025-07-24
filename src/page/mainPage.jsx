import Mainimage from "../component/Mainimage";
import Mainhead from "../component/Mainhead";
import Githubbutton from "../component/Githublink";
import '../style/mainPageStyle.css';

export default function Main() {
    return (
        <div className="main-page">
            <div className="page-section">
                <div className="tool-section">
                    <Githubbutton/>
                </div>
                <div className="main-section">
                    <Mainhead/>
                    <Mainimage/>
                </div>
            </div>
        </div>
    );
}