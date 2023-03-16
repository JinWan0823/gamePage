import { initMouseControlGame, setBoxDOM } from "./module/mouseControlModule.js";
import { handleModalClose } from "./utils/modal.js";



const initialize = () => {
    //modal의 버튼 세팅
    //retryButton에 게임 상태를 원복하는 함수를  실행
    const retryButton = document.getElementsByClassName('retry-button')[0];
    retryButton.onclick = () => handleModalClose(initMouseControlGame)
}

setBoxDOM({
    row:5,
    col:5,
    start:[0,0],
    end : [4,4],
    walls : [
        [1,0],
        [1,1],
        [1,2],
        [1,3],
        [3,0],
        [3,3],
        [3,1],
        [3,4]
    ]
});

initialize();