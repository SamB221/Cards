import React from 'react';
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
    return (
        <>
            <h1 className="centerText">Welcome to Fast FlashCards!</h1>
            <p className="centerText">Let's create a set</p>
            <div className="dualBox">
                <NavLink className="leftDualBox" to="/upload">
                    <p>Upload from CSV</p>
                    <img id="uploadIcon" src="../../../uploadIcon.svg" />
                </NavLink>
                <NavLink className="rightDualBox" to="/create">
                    <p>Create manually</p>
                    <img id="manualIcon" src="../../../manualIcon.svg" />
                </NavLink>
            </div>
        </>
    );
};

export default LandingPage;