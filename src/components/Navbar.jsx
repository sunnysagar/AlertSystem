import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import dataView from '../assets/view.png';
import dashboard from '../assets/dashboard.png';  
import reportGenrator from '../assets/analysis.png';
import alarm from '../assets/bell.png';
import companyLogo from '../assets/company_logo.png';
import plc from '../assets/plc.png';

import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';


export const Navbar = () =>{
    const { isAuthenticated} = useAuth();
    const [active, setActive] = useState(null);
   

    const navItems = [
        { id: 'Data View', icon: dataView, link: '/dashboardr', label: 'Data View' },
        { id: 'Dashboard', icon: dashboard, link: '/dashboard', label: 'Dashboard' },
        {id: 'PLC', icon: plc, link: '/plc', label: 'PLC'},
        { id: 'Report Generator', icon: reportGenrator, link: '/report-generator', label: 'Report Generator' },
        { id: 'Notification', icon: alarm, link: '/alarm', label: 'Notification' },
    ];


    return(
        <div className='navbar'>
            {/* left icons */}
           <div className='nav-group'>
                {navItems.slice(0, 3).map((item) => (
                    <NavItem key={item.id} item={item} active={active} setActive={setActive} />
                ))}

           </div>
              {/* right icons */}
            <div className='nav-group'>
                 {navItems.slice(3).map((item) => (
                      <NavItem key={item.id} item={item} active={active} setActive={setActive} />
                 ))}

            <img src={companyLogo} alt="company" className='company'/>
            </div>
         
        </div>
    );
};

const NavItem = ({item, active, setActive}) =>{
    const [hover, setHover] = useState(false);
    const navigate =  useNavigate();
    const handleNavClick = (link, id) => {
        window.open(link, '_blank');
        setActive(id);
    };

    return(
        <div
        className='nav-item'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => handleNavClick(item.link, item.id)}
        >
            <img src={item.icon} alt={item.label}  className='nav-icon'/>
            {/* show name on hover or when clicked */}
            {(hover || active === item.id) && <span className='nav-label'>{item.label}</span>}

        </div>
    );
};