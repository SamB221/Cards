import React from 'react';

const SetCard = ({ term, definition, mastery, bg = 'bg-gray-100' }) => {
    return (
        <div className={`${bg} p-6 rounded-lg shadow-md`}>
            <h2 className='float-left text-2xl font-bold'>
                {term}
            </h2>
            <p className='float-right mt-2 mb-4 text-2xl' id="masterylevel">
                {"Mastered: " + mastery}
            </p>
            <br />
            <p className='mt-2 mb-4'>
                {definition}
            </p>
        </div>
    );
};

export default SetCard;