import from021To022 from './0.21-0.22.js'
const migrations = [from021To022]

export async function run (OrbitDB, options, dbAddress) {
  for (let i = 0; i < migrations.length; i++) {
    await migrations[i](OrbitDB, options, dbAddress)
  }
}

export default  run
