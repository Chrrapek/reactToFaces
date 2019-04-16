import React from 'react';

const Rank = ({rank}) => {
    return (
        <div>
            <div className="white f3">
                {'Marcin, your current entry count is ...'}
            </div>
            <div className="white f1">
                {rank}
            </div>
        </div>
    )
};

export default Rank;
