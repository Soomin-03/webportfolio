export default function printMyself() {
    function showMyself() {
        <button
            onClick={() => {
                console.log("Name : Park SooMin");
                console.log("Age : 23");
            }}
            style={{
                color: 'white',
                backgroundColor: 'Black'
            }}
        >
            Myself
        </button>
    }
    function showMyportfolio() {
        <button
            onClick={() => {
                console.log("Sorry");
            }}
        >
            protfolio
        </button>
    }
    return (
        <div>
            <showMyself/>
            <showMyportfolio/>
        </div>
    )
}