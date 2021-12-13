
// const useEffect = React.useEffect;
// const useRef = React.useRef;

function App() {

const [displayTime, setDisplayTime] = React.useState(25*60);
const [breakTime, setBreakTime] = React.useState(5*60);
const [sessionTime, setSessionTime] = React.useState(25*60)
const [timerOn, SetTimerOn] = React.useState(false);
const [onBreak, setOnBreak] = React.useState(false);
// const [breakAudio, setBreakAudio] = React.useState(
//     new Audio("beep.mp3")
// )

let player = React.useRef(null)

React.useEffect(() => {
    if (displayTime <= 0) {
      //setOnBreak(true);
      playBreackSound();
    } else if (!timerOn && displayTime === breakTime) {
      //setOnBreak(false);
    }

  }, [displayTime, onBreak, timerOn, breakTime, sessionTime]);


const playBreackSound = () => {
    player.currentTime = 0;
    player.play();
}


const formatDisplayTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (
        (minutes < 10 ? "0" + minutes : minutes)+
        ':'+
        (seconds <10 ?"0" + seconds : seconds)
    );
};

const formatTime = (time) => {
    return time / 60;
};

const changeTime = (amount,type) => {
    if (type == "break") {
        if((breakTime<=60 && amount <0) || breakTime >= 60 * 60){
            return;
        }
        setBreakTime((prev)=> prev+amount);
    } else {
            if((sessionTime<=60 && amount <0) || sessionTime >= 60 * 60){
                return;
            }
            setSessionTime((prev)=> prev+amount)
        
            if(!timerOn){
                setDisplayTime(sessionTime+amount);
            }
        }
       
}

const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if(!timerOn){
        let interval = setInterval(() => {
            date = new Date().getTime();
            if (date > nextDate) {
                setDisplayTime((prev) => {
                    if(prev <=0 && !onBreakVariable){
                        //playBreackSound();
                        onBreakVariable=true;
                        setOnBreak(true)
                        return breakTime;
                    }else if (prev<=0 && onBreakVariable){
                        //playBreackSound();
                        onBreakVariable=false;
                        setOnBreak(false)
                        return sessionTime;
                    }
                    return prev-1;
                });
                nextDate += second;
            }
        }, 30);
        localStorage.clear();
        localStorage.setItem('interval-id',interval);   
    }
    if(timerOn){
        clearInterval(localStorage.getItem("interval-id"));
    }
    SetTimerOn(!timerOn)  
};



const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDisplayTime(25*60);
    setBreakTime(5*60);
    setSessionTime(25*60);
    setOnBreak(false);
    SetTimerOn(false);
    player.pause();
    player.currentTime = 0;
}   

    return (
        <div className="center-align">
            <h1>25+5 clock</h1>
            <div className="dual-container">
                <Length 
                    id = {"break-label"}
                    id_dec={"break-decrement"}
                    id_up={"break-increment"}
                    id_lenght="break-length"
                    title={'Break length'} 
                    changeTime={changeTime} 
                    type={"break"} 
                    time={breakTime} 
                    formatTime={formatTime}
                />
                <Length 
                    id = {"session-label"}
                    id_dec = {"session-decrement"}
                    id_up={"session-increment"}
                    id_lenght="session-length"
                    title={'Session length'} 
                    changeTime={changeTime} 
                    type={"session"} 
                    time={sessionTime}
                    formatTime={formatTime}
                />
            </div>
            <h3 id="timer-label">{onBreak ? 'Break' : 'Session'}</h3>
            <h1 id="time-left">{formatDisplayTime(displayTime)}</h1>
            <button id="start_stop" className='btn-large deep-purple lighten-2' onClick={controlTime}>
                {timerOn ? (
                    <i className="material-icons">pause_circle_filled</i>
                ): (
                    <i className="material-icons">play_circle_filled</i> 
                )}
            </button>
            <button  id="reset" className='btn-large deep-purple lighten-2' onClick={resetTime}>
                    <i className="material-icons">autorenew</i>
            </button>
            <audio ref={(t) => (player = t)} src='beep.mp3' id="beep" />
        </div>
    )
}


function Length({id,id_dec,id_up,id_lenght,initialValue,title, changeTime, type, time, formatTime}){
    return (
        <div>
            <h3 id={id}>{title}</h3>
            <div className="time-sets">
                <button id={id_dec} className="btn-small deep-purple lighten-2"
                    onClick={() => changeTime(-60,type)}
                >
                    <i className="material-icons">arrow_downward</i>
                </button>
                <h3 id = {id_lenght} value={initialValue} >{formatTime(time)} </h3>
                <button id={id_up} className="btn-small deep-purple lighten-2"
                    onClick={() => changeTime(60,type)}
                >
                    <i className="material-icons">arrow_upward</i>
                </button>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
