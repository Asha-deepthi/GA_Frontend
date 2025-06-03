import React, { useState, useEffect } from 'react';
import './PositionsDashboard.css'; 

const PositionsDashboard = () => {
    const [currentUser, setCurrentUser] = useState('Arjun Patel');
    const [profileInitial, setProfileInitial] = useState('AP');
    const [activeNav, setActiveNav] = useState('Positions'); 
    const positionsData = [
        {
            id: 1,
            title: 'Senior Digital Media Planner',
            description: 'Work closely with supervisor to develop strategic and integrated media planning & recommendations, implement media plans and monitor the whole process from...',
            date: '13/05/2023 21:49',
            stats: [
                { number: 20, label: 'Invitations' },
                { number: 12, label: 'No response' },
                { number: 7, label: 'Pending' },
                { number: 0, label: 'No posted' }, 
                { number: 1, label: 'Passed' },
            ],
        },
        {
            id: 2,
            title: 'Frontend Developer (React)',
            description: 'Join our dynamic team to build cutting-edge user interfaces using React, Redux, and modern JavaScript. Collaborate with UI/UX designers and backend developers.',
            date: '15/06/2023 10:30',
            stats: [
                { number: 35, label: 'Invitations' },
                { number: 10, label: 'No response' },
                { number: 15, label: 'Pending' },
                { number: 5, label: 'No posted' },
                { number: 5, label: 'Passed' },
            ],
        },
        {
            id: 3,
            title: 'UX/UI Designer',
            description: 'We are looking for a creative UX/UI Designer to shape the user experience of our web and mobile applications. Proficiency in Figma, Sketch, or Adobe XD is required.',
            date: '20/06/2023 14:00',
            stats: [
                { number: 15, label: 'Invitations' },
                { number: 5, label: 'No response' },
                { number: 8, label: 'Pending' },
                { number: 0, label: 'No posted' },
                { number: 2, label: 'Passed' },
            ],
        },
        
    ];


    useEffect(() => {
       
        const storedUser = localStorage.getItem('currentUser') || 'Arjun Patel';
        setCurrentUser(storedUser);

        
        const initials = storedUser.split(' ').map(name => name[0]).join('');
        setProfileInitial(initials.toUpperCase());

        document.title = "Positions Dashboard"; 
    }, []);

    const handleNavClick = (navItem) => {
        setActiveNav(navItem);
        
        alert(`Navigating to ${navItem}`);
    };

    const handlePositionCardClick = (positionTitle) => {
        alert(`Position details for "${positionTitle}" would open here`);
    };

    const handleCreateTestClick = (e) => {
        e.preventDefault();
        alert('Create test form would open here');
    };

    return (
        <>
            <header>
                <div className="container header-content">
                    <div className="logo"></div>
                    <div className="nav-links">
                        {['Home', 'Evaluations', 'Positions'].map(item => (
                            <a
                                key={item}
                                href="#"
                                className={`nav-link ${activeNav === item ? 'active' : ''}`}
                                onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                    <div className="profile">
                        <div className="profile-img">{profileInitial}</div>
                        <span className="username">{currentUser}</span>
                    </div>
                </div>
            </header>

            <div className="create-test-banner">
                <div className="container">
                    <a href="#" className="create-test-link" onClick={handleCreateTestClick}>
                        Create a test
                    </a>
                </div>
            </div>

            <div className="container">
                {positionsData.map(position => (
                    <div
                        key={position.id}
                        className="position-card"
                        onClick={() => handlePositionCardClick(position.title)}
                    >
                        <h2 className="position-title">{position.title}</h2>
                        <p className="position-description">{position.description}</p>
                        <div className="position-date">{position.date}</div>
                        <div className="position-stats">
                            {position.stats.map(stat => (
                                <div className="stat" key={stat.label}>
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PositionsDashboard;