import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import dataView from '../assets/view.png';
import dashboard from '../assets/share.png';
import reportGenrator from '../assets/analysis.png';
import alarm from '../assets/bell.png';
import companyLogo from '../assets/company_logo.png';

import '../styles/Navbar.css';


export const Navbar = () =>{
    const { isAuthenticated} = useAuth();
    const [active, setActive] = useState(null);

    const navItems = [
        { id: 'Data View', icon: dataView, link: '/data-view', label: 'Data View' },
        { id: 'Dashboard', icon: dashboard, link: '/dashboard', label: 'Dashboard' },
        { id: 'Report Generator', icon: reportGenrator, link: '/report-generator', label: 'Report Generator' },
        { id: 'Notification', icon: alarm, link: '/alarm', label: 'Notification' },
    ];

   
    return(
        <div className='navbar'>
            {/* left icons */}
           <div className='nav-group'>
                {navItems.slice(0, 2).map((item) => (
                    <NavItem key={item.id} item={item} active={active} setActive={setActive} />
                ))}

           </div>
              {/* right icons */}
            <div className='nav-group'>
                 {navItems.slice(2).map((item) => (
                      <NavItem key={item.id} item={item} active={active} setActive={setActive} />
                 ))}

            <img src={companyLogo} alt="company" className='company'/>
            </div>
         
        </div>
    );
};

const NavItem = ({item, active, setActive}) =>{
    const [hover, setHover] = useState(false);

    return(
        <div
        className='nav-item'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setActive(item.id)}
        >
            <img src={item.icon} alt={item.label}  className='nav-icon'/>
            {/* show name on hover or when clicked */}
            {(hover || active === item.id) && <span className='nav-label'>{item.label}</span>}

        </div>
    );
};