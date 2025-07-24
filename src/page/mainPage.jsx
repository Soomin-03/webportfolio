import Mainimage from "../component/Mainimage";
import Mainhead from "../component/Mainhead";
import Mainprofile from "../component/Mainprofile";
import Maineducation from "../component/Maineducation";
import Mainproject from "../component/Mainproject";
import Mainlicense from "../component/Mainlicense";
import Mainskill from "../component/Mainskill";
import Githubbutton from "../component/Githublink";
import '../style/mainPageStyle.css';

export default function Main() {
    return (
        <div className="main-page">
            <div className="tool-section">
                <Githubbutton/>
            </div>
            <div className="main-section">
                <Mainhead/>
                <Mainimage/>
            </div>
        </div>
    );
}