import blockchain from './blockchain/index.mjs';
import manager from './task-manager.mjs';
export default async () => {
    return blockchain(await manager());
};
