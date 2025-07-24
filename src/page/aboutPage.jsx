import Abouthead from "../component/Abouthead";
import Mainimage from "../component/Mainimage";
import Aboutprofile from "../component/Aboutprofile";
import Abouteducation from "../component/Abouteducation";
import Aboutlicense from "../component/Aboutlicense";
import Aboutproject from "../component/Aboutproject";
import Aboutskill from "../component/Aboutskill";
import '../style/aboutPageStyle.css';

export default function About() {
    return (
        <div className="about-page">
            <div className="page-section">
                <Abouthead/>
                <div className="about-section">
                    <Mainimage/>
                    <div className="about-sub-section">
                        <Aboutprofile/>
                        <Abouteducation/>
                        <Aboutlicense/>
                        <Aboutproject/>
                    </div>
                    <Aboutskill/>
                </div>
            </div>
        </div>
    );
}