import { DEFAULT_ENGINE_KEY } from '../common/constants';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChessContext } from './context';
const Welcome = () => {
    const navigate = useNavigate();
    const chessContext = React.useContext(ChessContext)
    const [step, setStep] = useState(0);
    const clickPvc = () => {
        setStep(2);
        chessContext.setRedSide('human');
        chessContext.setBlackSide(DEFAULT_ENGINE_KEY);
    }
    const clickPvp = () => {
        chessContext.setRedSide('human');
        chessContext.setBlackSide('human');
        navigate("/board/true");
    }
    const clickCvc = () => {
        chessContext.setRedSide(DEFAULT_ENGINE_KEY);
        chessContext.setBlackSide(DEFAULT_ENGINE_KEY);
        chessContext.setDifficulty(3);
        navigate("/board/true");
    }
    const renderMenu = () => {
        if(step ===0){
            return <div className='menu_box'>
            <a onClick={()=>{chessContext.setMode("normal");setStep(1);}}>普通模式</a>
            <a onClick={()=>{chessContext.setRedSide("human"); chessContext.setMode("free");chessContext.setBlackSide("human");navigate("/board/true");}}>自由模式</a>

            <a onClick={chessContext.exit}>退出</a>
        </div>
        }
        if (step === 1) {
            return <div className='menu_box'>
                <a onClick={clickPvc}>人機對弈</a>
                <a onClick={clickPvp}>人人對弈</a>
                <a onClick={clickCvc}>機器對弈</a>
                <a onClick={() => setStep(0)}>上一步</a>
            </div>
        } else if (step === 2) {
            return <div className='menu_box'>
                <a onClick={() => { chessContext.setDifficulty(1); setStep(3) }}>初級水平</a>
                <a onClick={() => { chessContext.setDifficulty(2); setStep(3) }}>中級水平</a>
                <a onClick={() => { chessContext.setDifficulty(3); setStep(3) }}>高級水平</a>
                <a onClick={() => setStep(1)}>上一步</a>
            </div>
        } else if (step === 3) {
            return <div className='menu_box'>
                <a onClick={() => { navigate("/board/true"); }}>執紅</a>
                <a onClick={() => { chessContext.setRedSide(chessContext.blackSide); chessContext.setBlackSide(chessContext.redSide); navigate("/board/false"); }}>執黑</a>
                <a onClick={() => setStep(2)}>上一步</a>
            </div>
        }
    }
    React.useEffect(() => {
        chessContext.setType('welcome')
    }, [])
    return <div className='welcome'>
        <div className='title' style={{ padding: 60 }}>
            <span>中國象棋</span>
        </div>
        <div className='stack'>
            <div className='menu'>
                <div className='board'>
                    {renderMenu()}
                </div>
            </div>
        </div>
    </div>
}
export default Welcome;