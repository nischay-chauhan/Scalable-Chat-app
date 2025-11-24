import db from '../db';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
    try {
        await execAsync('rm -f chat.db');
    } catch (error) {
    }
});

jest.setTimeout(15000);
