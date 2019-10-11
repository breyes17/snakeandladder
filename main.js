let activePlayer;
let data = (function(){
    let player = {
        p1 : 0,
        p2 : 0
    }

let jCell = {
    1:38,4:14,9:31,21:42,28:84,36:44,51:67,71:91,80:100,
    16:6,47:26,49:11,56:53,62:19,64:60,87:24,93:73,95:75,98:78
}

    return{
        Player : function(){
            return player;
        },
        updateScore : function(activeP,dice){
            let ap = `p${activeP}`;
            let curScore = player[ap]+dice;

            if(curScore <= 100){
                player[ap] = curScore;
            } else {
                player[ap] = 100 - (curScore - 100);
            }
        },
        jumpCell : function(){
            return jCell;
        },
        resetData : function(){
            player.p1 = 0;
            player.p2 = 0;
        }
    }
})();

let view = (function(){
    let domStrings = {
        btn : '.btn',
        p1score : '.score-1',
        p2score : '.score-2',
        turn : '.player-turn',
        img : '.image',
        rolldiceTxt : 'Roll the Dice!',
        startGameTxt : 'Start the game!',
        p1Color : '#00BEFE',
        p2Color : '#ACFE2E',
        popCont : '.popup-container',
        popBody : '.popup-body',
        popNgame : '.ngame',
        year : '.cyear',
        win : '.winner',
        cells : '.cells',
        vers : '.vers',
        subvers : '.subvers'
    }
    return{
        dom : function(){
            return domStrings;
        },
        initView : function(){
            document.querySelector(domStrings.turn).textContent = '...';
            document.querySelector(domStrings.btn).textContent = domStrings.startGameTxt;
            document.querySelector(domStrings.img).style.display = 'none';
            let dom = document.querySelectorAll(`${domStrings.p1score},${domStrings.p2score}`);
            Array.from(dom).forEach(x => {
                if(x.className.includes('active')){
                    x.classList.remove('active'); 
                }
                document.querySelector(`.${x.className}`).textContent = 0;
            });
        },
        resetView : function(){
            document.querySelector(domStrings.turn).textContent = `Player 1`;
            document.querySelector(domStrings.btn).textContent = domStrings.rolldiceTxt;
            document.querySelector(`.score-1`).classList.toggle('active');
            // document.querySelector(domStrings.popCont).style.display = 'none';
        },
        dice : function(){
            return Math.floor((Math.random()*6)+1);
        },
        updateImg : function(n){
            let dom = document.querySelector(domStrings.img);
            dom.style.display = 'block';
            dom.src = `images/dice-${n}.png`;
            dom.alt = `dice-${n}`;
            setTimeout(()=>{
                dom.style.display = 'none';
            },1500);
        },
        nextPlayer : function(){
            let curPlayer = activePlayer === 1 ? 2 : 1;
            document.querySelector(`.score-${activePlayer}`).classList.toggle('active');
            // update the global activePlayer
            activePlayer = curPlayer;
            setTimeout(()=>{
                document.querySelector(`.score-${curPlayer}`).classList.toggle('active');
                document.querySelector(domStrings.turn).textContent = `Player ${curPlayer}`;
            },1000)

        },
        updateTable : function(ap,score){
            console.log(`updateTable ${ap} : ${score}`)
            if(ap !== undefined && score !== undefined){
                let cell = `.cell-${score}`;
                let activeC = `p${ap}`;
                let Domcells = document.querySelectorAll('.cells');
                Array.from(Domcells).forEach(x =>{
                    x.classList.remove(activeC);
                });
                document.querySelector(`.score-${ap}`).textContent = score;
                document.querySelector(cell).classList.toggle(activeC);   
            } else {
                let dom = document.querySelectorAll(domStrings.cells);
                Array.from(dom).forEach(x => x.classList.remove('p1','p2'));
            }
        
        },
        updateCell : function(obj){
            let o = Object.entries(obj);
            o.forEach(x=>{
                document.querySelector(`.cell-${x[1][0]}`).firstChild.textContent = `${x[1][0]} (Move to ${x[1][1]})`;
            })
        },
        showWinner: function(n){
            document.querySelector(domStrings.popCont).style.display = 'flex';
            document.querySelector(domStrings.win).textContent = n;
        },
        vers: function(v){
            // let ver = 1, subvers = 1;
            document.querySelector(domStrings.vers).textContent = v;
            // document.querySelector(domStrings.subvers).textContent = s;
        }
    }
})();

let controller = (function(d,v){

    const win = () => {
        v.showWinner(activePlayer);
        setTimeout(() => {
            v.initView();
            d.resetData();
            v.updateTable();
        },2000);
    }


    let setupEvent = function(){
        let btn = document.querySelector(v.dom().btn)
        btn.addEventListener('click',()=>{
            let txt = btn.textContent;
            if(txt === v.dom().startGameTxt){
                v.resetView();
            } else{
                btn.disabled = true; // disabled the button
                console.log('the game is starting');   
                let dice = v.dice();
                let p = `p${activePlayer}`;
                let score, newScore, cond=true;
                // update dice image
                v.updateImg(dice);
                // update player score
                let prevScore = d.Player()[p];
                d.updateScore(activePlayer,dice);
                // update the view of table
                score = d.Player()[p];
                v.updateTable(activePlayer,score);

                if(score !== 100){
                    // jump Cell
                    newScore = d.jumpCell()[score];
                    console.log(`newScore ${newScore}`);
                    if(newScore){
                        cond = false
                        setTimeout(()=>{
                            d.Player()[p] = 0;
                            d.updateScore(activePlayer, newScore);
                            v.updateTable(activePlayer, newScore);
                            if(d.Player()[p] === 100){
                                console.log('we have a winner! <in if else>');
                                win();
                            } else {
                                v.nextPlayer();
                            }
                        },1500);
                    }
                    console.log(`player ${activePlayer} : previous score ${prevScore} |current score = ${d.Player()[`p${activePlayer}`]} : dice = ${dice}`)
                    // next Player
                    if(cond){
                        v.nextPlayer();
                    }
                } else {
                    console.log('we have a winner!');
                    win();
                }
                
            }
            setTimeout(() => btn.disabled=false,2000); // enabled the button
        });

        document.querySelector(v.dom().popCont).addEventListener('click', e =>{
            console.log(e.target.className);
            if(`.${e.target.className}` !== v.dom().popBody){
                document.querySelector(v.dom().popCont).style.display = 'none';
            }
        })
    }

    return{
        init : function(){
            console.log('Game has started');
            activePlayer = 1;
            d.resetData();
            v.initView();
            document.querySelector(v.dom().popCont).style.display = 'none';
            document.querySelector(v.dom().year).textContent = new Date().getFullYear();
            let obj = Object.entries(d.jumpCell());
            v.updateCell(obj);
            setupEvent();
            v.vers('1.0.2');
        }
    }
})(data,view);  
// move up 1:38,4:14,9:31:21:42,28:84,36:44,51:67,71:91,80:100
// move down 16:6,47:26,49:11,56:53,62:19,64:60,87:24,93:73,95:75,98:78
controller.init()

/*
Version
v1.0.1 = Add disabling/enabling the button
        Make the font family online
        increase the width of cell from 75 to 85px / decrease height of cell from 75px to 70px

v.1.0.2 = Optimize the disabling / enabling the button
        Add delay for about 2 seconds when there is a winner
        update the vers function to accept only 1 argument
*/
