import React from 'react';
import { Route, Routes } from 'react-router-dom'
import logs from './utils/debug/index.js'
import { Pane } from 'evergreen-ui'
import './App.css';
import { actions, loadingState, StateProvider } from './state'
import Header from './components/Header'
import Systems from './components/Systems'

import SearchResultsView from './views/SearchResults'
import DatabasesView from './views/DatabasesView'
import DatabaseView from './views/DatabaseView'

const debug = (maxCount, id, ...args) => {
    let path = 'App'
    let from = path.search('src');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(maxCount,url, id, args)
}

function App(props) {
    const {IPFS, OrbitDB} = props

    const initialState = {
        user: null,
        loginDialogOpen: false,
        createDBDialogOpen: false,
        addDBDialogOpen: false,
        programs: [],
        program: false,
        db: null,
        entries: [],
        orbitdbStatus: 'Starting',
        ipfsStatus: 'Starting',
        loading: {
            programs: false
        },
        IPFS: IPFS,
        OrbitDB: OrbitDB
    }

    const reducer = (state, action) => {
        debug(-5,'👥[(App)reducer]', action.type)
        switch (action.type) {
            case actions.SYSTEMS.SET_ORBITDB:
                return {
                    ...state,
                    orbitdbStatus: action.orbitdbStatus
                }
            case actions.SYSTEMS.SET_IPFS:
                return {
                    ...state,
                    ipfsStatus: action.ipfsStatus
                }
            case actions.PROGRAMS.SET_PROGRAM:
                return {
                    ...state,
                    program: action.program
                }
            case actions.PROGRAMS.SET_PROGRAM_LOADING:
                return {
                    ...state,
                    program: loadingState
                }
            case actions.PROGRAMS.SET_PROGRAMS:
                return {
                    ...state,
                    programs: action.programs
                }
            case actions.DB.SET_DB:
                return {
                    ...state,
                    db: action.db,
                    entries: action.entries,
                }
            case actions.DB.OPEN_CREATEDB_DIALOG:
                return {
                    ...state,
                    createDBDialogOpen: true
                }
            case actions.DB.CLOSE_CREATEDB_DIALOG:
                return {
                    ...state,
                    createDBDialogOpen: false
                }
            case actions.DB.OPEN_ADDDB_DIALOG:
                return {
                    ...state,
                    addDBDialogOpen: true
                }
            case actions.DB.CLOSE_ADDDB_DIALOG:
                return {
                    ...state,
                    addDBDialogOpen: false
                }
            case actions.PROGRAMS.SET_PROGRAMS_LOADING:
                return {
                    ...state,
                    loading: { ...state.loading, programs: action.loading }
                }
            default:
                return state
        }
    }
    console.log('< ================================== >')
    return (
        <StateProvider
            initialState={initialState}
            reducer={reducer}
        >
            <Pane background='tint1' height='100%'>
                <Header />
                <Systems/>
                <Routes>
                    <Route path='/search' element={<SearchResultsView/>} />
                    <Route path='/orbitdb/:programName/:dbName' element={<DatabaseView/>}/>
                    <Route path='/' element={<DatabasesView/>}/>
                </Routes>
            </Pane>
        </StateProvider>
  );
}

export default App;
