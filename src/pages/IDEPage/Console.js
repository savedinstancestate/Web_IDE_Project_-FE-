import React from 'react';
import './Console.css';

const Console = ({ result }) => {
    return (
        <div className="console">
            <pre>{result}</pre>
        </div>
    );
};

export default Console;
