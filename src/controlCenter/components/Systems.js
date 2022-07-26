import React from 'react'
import {
  majorScale,
  minorScale,
  Pane,
  Text,
  StatusIndicator
} from 'evergreen-ui'

import { initIPFS, initOrbitDB, getAllDatabases } from '../database/index.js'
import { actions, useStateValue } from '../state'
import ConnectToWalletButton from './ConnectToWalletButton'
import logs from '../utils/debug/index.js'

function Systems (props) {
  const [appState, dispatch] = useStateValue()
  let debug = (id, ...args) => {
    let path = 'palette/src/github.com/zababurinsv/newkind-db/frontend/src/components/newkind-control/src/components/Systems.js'
    let from = path.search('db');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-4,url, id, args)
  }

  React.useEffect(() => {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })
    debug('o!o[(useEffect)appState]',appState)
    initIPFS({
      IPFS: appState.IPFS
    })
    .then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started' })
      // @ts-ignore
      initOrbitDB({
        ipfs: ipfs,
        OrbitDB: appState.OrbitDB
      })
      .then(async (db) => {
        dispatch({ type: actions.SYSTEMS.SET_ORBITDB, orbitdbStatus: 'Started' })
        const programs = await getAllDatabases()
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
      })
    })
  }, [dispatch])

  return (
    <Pane background='white' elevation={1}>
      <Pane
        display='flex'
        flexDirection='row'
        alignItems='left'
        paddingX={majorScale(6)}
        paddingY={majorScale(1)}
      >
        <Pane display='flex' flexDirection='row' width='100%'>
          <Text
            display='flex'
            alignItems='center'
            fontWeight='600'
            marginRight={minorScale(1)}
          >
            Systems:
          </Text>
          {
            appState.ipfsStatus === 'Started'
              ? <StatusIndicator color='success'>IPFS</StatusIndicator>
              : <StatusIndicator color='warning'>IPFS</StatusIndicator>
          }
          {
            appState.orbitdbStatus === 'Started'
              ? <StatusIndicator color='success'>OrbitDB</StatusIndicator>
              : <StatusIndicator color='warning'>OrbitDB</StatusIndicator>
          }
          <ConnectToWalletButton style={{ marginLeft: 'auto' }} />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Systems
