import backgroundImage from '../asset/background_img.jpg';

export default function Aboutimage() {
    const circularImageStyle = {
        width : '25vw',
        height : '25vw',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #FFFFFF',
    }

    return (
        <div>
            <img src={backgroundImage} alt="Background" style={circularImageStyle}/>
        </div>
    )
}