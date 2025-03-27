import React from 'react'

const Card = ({ term, definition, bg = 'bg-gray-100' }) => {
    return (
        <div className={`${bg} p-6 rounded-lg shadow-md`}>
            <h2 className='text-2xl font-bold'>
                {term}
            </h2>
            <p className='mt-2 mb-4'>
                {definition}
            </p>
        </div>
    )
};

export default Card;