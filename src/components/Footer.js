import React from 'react'
import './Footer.css'

export default function Footer() {
    return (
        <ul className="footer-social-icons">
        <li>
            <a href="https://discord.gg/nujAyCAdv9" target="_blank"  rel="noreferrer" >
            <div className="social-icon">
                <img src={`${process.env.PUBLIC_URL}/assets/discord.svg`} alt="Discord" />
            </div>
            </a>
        </li>
        </ul>
    )
}