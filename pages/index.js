import { useState } from 'react';
import axios from 'axios';
import path from 'path';
import Image from 'next/image';
import imagem from '../public/assets/img/qrcode.png';

function Home (){

    // const [img,setImg] = useState('/public/assets/img/qrcode.png');
    // const [img,setImg] = useState('../qrcode.png');

    const sendZap = async e =>{
        e.preventDefault();
        await axios.get('/api/zap');

        setImg('./assets/img/qrcode.png' );
    }
    return (
        <div>

            <h1>ZAP</h1>

            <hr></hr>

            <button onClick={sendZap}>APERTE</button>
        
            I<Image src={imagem} alt="OLOKO" width="520" height="520" />

        </div>
        
    )
}


export default Home;