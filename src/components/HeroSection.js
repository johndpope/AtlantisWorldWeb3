import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';



export default function HeroSection() {
    return (
        <div className='hero-container'>
            <video src='./videos/cropWatermark.mp4' type='video/mp4' autoPlay loop muted />
            <h1> Atlantis World</h1>
            <p>Metaverse</p>  
            <div className="hero-btns">
                <Link to={{ pathname: "https://123scq.netlify.app/" }} target="_blank" className="play">
                    <button className="play">Get Started</button>
                </Link>
            </div>          
        </div>
    )
}
