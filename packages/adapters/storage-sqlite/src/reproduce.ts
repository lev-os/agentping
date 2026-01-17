import { SQLiteStore } from './index';
import { homedir } from 'os';
import { join } from 'path';

async function main() {
    const dbPath = join(homedir(), '.agentping', 'agentping.db');
    console.log(`Opening database at ${dbPath}`);

    const store = new SQLiteStore(dbPath);
    await store.initialize();

    try {
        console.log('Fetching pending pings...');
        const pings = await store.findPending();
        console.log(`Found ${pings.length} pings`);
        pings.forEach(p => console.log(`Ping ${p.id}: ${p.type}`));
    } catch (error) {
        console.error('Error fetching pings:', error);
        if (error instanceof Error) {
            console.error(error.stack);
        }
    } finally {
        await store.close();
    }
}

main().catch(console.error);
