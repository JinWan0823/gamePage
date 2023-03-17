import { TOUCH_NUMBER_SCORE_KEY } from "./constants/localStorage.js";
import { handleModalClose, handleModalOpen } from "./utils/modal.js";
import { getNowTime, getResultTimeString, setTimer, startTimer, stopTimer } from "./utils/timer.js";

const numberButtonList = document.getElementsByClassName('number-button');
const maxId = numberButtonList.length;
let currentNumber = 1;

const handleSuccessGame = ()=>{
    stopTimer();
    handleModalOpen({
        isSuccess:true,
        timeString:getResultTimeString()
    });

    const nowSpendTime = getNowTime();
    const currentSpendTime = localStorage.getItem(TOUCH_NUMBER_SCORE_KEY);
    if(!currentSpendTime || currentSpendTime > nowSpendTime){
        localStorage.setItem(TOUCH_NUMBER_SCORE_KEY,nowSpendTime)
    }

    setTimer(0);
}

const handleFailedGame = () => {
    stopTimer();

    handleModalOpen({
        isSuccess:false,
    })

    setTimer(0);
}

const setButtonDOM = ()=>{
    // 1. HTML상에서 domList를 밥ㄷ아옴
    // 2. 순회하면서 dom의 위치를 조정(랜덤)
    // 3. dom클릭 시 핸들러 등록

    for(let numberButton of numberButtonList){
        numberButton.style.display="block";
        numberButton.style.top = `${Math.floor(Math.random()*100 *0.9)}%`;
        numberButton.style.left = `${Math.floor(Math.random()*100 *0.9)}%`;
        numberButton.onclick=(event)=>{
            // 클릭한 수를 찾아오기
            // 숫자가 현재 클릭되어야 하는 수가 맞는 지 판단 -> 아니라면 무시, 맞다면 해당 numberbutton을 없앰
            // 1을 클릭할경우 타이머 시작 
            // 10을 클릭했을 때는 타이머 멈춤 -> 성공 모달
            const numId =Number(event.target.innerHTML);
            if(isNaN(numId)) return;
            if(numId !==currentNumber){
                return;
            }
            event.target.style.display="none";

            if(numId === maxId){
                //성공모달
                handleSuccessGame();
                return;
            }
            if(numId === 1) {
                startTimer(handleFailedGame);
            }
            currentNumber++;


        }
    }
    

};

const initailizeTouchNumberGame = () => {
    // 타이머 다시 세팅
    // 숫자의 위치를 다시 세팅
    // 숫자가 다시 나타날 수 있게 -> setButtonDom 함수로 초기화
    // currentNumber -> 1로 다시 세팅
    setTimer(0);
    stopTimer();
    setButtonDOM();
    currentNumber=1;
}

const initailize = () => {
    // modal - retry , header - retry
    // 클릭 시 모달 닫기,  상태를 원복
    const [headerRetryButton,modalRetryButton] = document.getElementsByClassName('retry-button');
    headerRetryButton.onclick=()=>{
        handleModalClose(initailizeTouchNumberGame);
    };
    modalRetryButton.onclick = () =>{
        handleModalClose(initailizeTouchNumberGame);
    }
}

setButtonDOM();
initailize();