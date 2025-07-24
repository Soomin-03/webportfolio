import backgroundImage from '../asset/background_img.jpg';

export default function Mainimage() {
    const circularImageStyle = {
        width : '50vw',
        height : '50vw',
        borderRadius: '50%',
        objectFit: 'cover',
        border: 'none',
    }

    return (
        <div>
            <img src={backgroundImage} alt="Background" style={circularImageStyle}/>
        </div>
    )
}