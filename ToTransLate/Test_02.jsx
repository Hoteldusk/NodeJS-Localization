import React from 'react';

const App = () => {
    return (
        <div>
            <h1>안녕하세용</h1>
            <p>테스트입니다</p>
        </div>
    );
};

const Welcome = ({ name }) => {
    return (
        <div>
            <h2>환영합니다, {name}!</h2>
            <p>어서오세요.</p>
        </div>
    );
};

const AppContainer = () => {
    return (
        <div>
            <App />
            <Welcome name="사용자" />
        </div>
    );
};

export default AppContainer;