import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
const container = document.querySelector('#root');

function AppWithCallbackAfterRender(props) {
    const {IPFS, OrbitDB} = props

    useEffect(() => {
        console.log('rendered');
    });

    return <App
        tab="home"
        IPFS={ IPFS }
        OrbitDB={ OrbitDB }
    />
}

export default (props) => {
    const {IPFS, OrbitDB} = props
    const root = createRoot(container);
    root.render(
        <BrowserRouter>
            <AppWithCallbackAfterRender
                IPFS={IPFS}
                OrbitDB={OrbitDB}
            />
        </BrowserRouter>,
    );
}
