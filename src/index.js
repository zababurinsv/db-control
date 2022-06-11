import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
const container = document.querySelector('#root');

function AppWithCallbackAfterRender({ IPFS }) {
    useEffect(() => {
        console.log('rendered');
    });

    return <App
        tab="home"
        IPFS={ IPFS }
    />
}

export default (IPFS) => {
    const root = createRoot(container);
    root.render(
        <BrowserRouter>
            <AppWithCallbackAfterRender
                IPFS={IPFS}
            />
        </BrowserRouter>,
    );
}
