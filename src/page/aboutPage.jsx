import Abouthead from "../component/Abouthead";
import Mainimage from "../component/Mainimage";
import '../style/aboutPageStyle.css';

export default function About() {
    return (
        <div className="about-page">
            <Abouthead />
            <div>
                <Mainimage />
            </div>
        </div>
    );
}