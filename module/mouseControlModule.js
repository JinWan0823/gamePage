import { MOUSE_CONTROL_SCORE_KEY } from "../constants/localStorage.js";
import { makeDOMwithProperties } from "../utils/dom.js"
import { handleModalOpen } from "../utils/modal.js";
import { getNowTime, getResultTimeString, isGameStart, setTimer, startTimer, stopTimer } from "../utils/timer.js";

let boxDOMList = [];
let wallBoxDOMList = [];
let startBoxDOM = null;
let endBoxDOM = null;

const gameFieldDOM = document.getElementById('game-field');

export const initMouseControlGame = () => {
    startBoxDOM.innerHTML = "시작";
    endBoxDOM.innerHTML ="끝";
    boxDOMList.forEach((boxDOM)=>{
        boxDOM.style.backgroundColor="transparent";
    })
    stopTimer();
    setTimer(0);
}


const handleFailedGame = () => {
    stopTimer();
    handleModalOpen({
        isSuccess:false,
    })
    setTimer(0)
}
const handleSuccesGame = () => {
    stopTimer();
    handleModalOpen({
        isSuccess: true,
        timeString : getResultTimeString(),
    });

    //게임 성공 시 localStorage에 갱신된 최고 점수 (최소 소요 시간 저장)
    const nowScore = getNowTime();
    const currentScore = localStorage.getItem(MOUSE_CONTROL_SCORE_KEY);
    if(!currentScore || currentScore > nowScore){
        localStorage.setItem(MOUSE_CONTROL_SCORE_KEY,nowScore);
    }


    setTimer(0);
    //성공 모달
}

export const setBoxDOM = ({
    row,
    col,
    start,
    end,
    walls,
}) =>{
    // control-box-container 를 만들고
    // box들을 채우기

    const controlBoxContainer = makeDOMwithProperties('div',{
        id:'control-box-container',
        onmouseleave : () => {
            if(!isGameStart) return;
            handleFailedGame();
        }
    })

    controlBoxContainer.style.display ="grid";
    controlBoxContainer.style.gridTemplateRows = `repeat(${row},1fr)` ;
    controlBoxContainer.style.gridTemplateColums = `repeat(${col},1fr)`;

    for(let i = 0;i<row;i++){
        for(let j =0;j<col;j++){
            const {className, innerHTML = '', type, onmouseover } = (function(){
               if(i=== start[0] && j=== start[1]){ //시작 위치
                    return{
                        type:'start',
                        className:'control-box start',
                        innerHTML:"시작",
                        onmouseover: (event) =>{
                            //게임 시작 -> 타이머가 시작
                            startTimer(handleFailedGame);

                            event.target.innerHTML = '';
                            //innerHTML을 없애기
                            //게임 시작 변수 변경
                        }
                    }
               }
               if(i=== end[0] && j===end[1]){
                    return {
                        type:'end',
                        className : 'control-box end',
                        innerHTML : '끝',
                        onmouseover: (event) =>{
                            if(!isGameStart) return;
                            event.target.innerHTML ="";
                            handleSuccesGame();
                        }
                    }
               }
               for(let wall of walls){
                    if(i===wall[0] && j ===wall[1]){
                        return {
                            type :'wall',
                            className : 'control-box wall',
                            onmouseover: () =>{
                                if(!isGameStart) return;
                                handleFailedGame();
                            }
                        }
                    }
               }
               return {
                type:'normal',
                className:'control-box',
                onmouseover: (event) =>{
                    if(!isGameStart) return;

                    event.target.style.backgroundColor = "linen"
                }
               }
            }())
            const boxDOM = makeDOMwithProperties('div',{
                className ,
                innerHTML ,
                id :`box-${i}-${j}`,
                onmouseover,
            })

            switch(type) {
                case 'start' :
                    startBoxDOM = boxDOM;
                    break;
                case 'end' :
                    endBoxDOM = boxDOM;
                    break;
                case 'wall' :
                    wallBoxDOMList.push(boxDOM);
                    break;
                default:
                    boxDOMList.push(boxDOM)
            }

            
            controlBoxContainer.appendChild(boxDOM)
        }
    }

    gameFieldDOM.appendChild(controlBoxContainer);

}