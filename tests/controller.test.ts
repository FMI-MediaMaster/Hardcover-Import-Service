import runImportTests, { Fields } from '@media-master/import-service-tests';
import { Express } from 'express';
import { describe} from 'vitest';
import app from '../src/app';

const server = app as Express;

describe('Controller', () => {
    const endpoint: string = '';
    const validIds: string[] = [
        '1',
        '6',
        '16135',
    ];
    const invalidIds: string[] = [
        '-1',
        'Not an id',
        'nonExistentId',
    ];
    const fields: Fields = {
        name: { type: 'string' },
    };
    runImportTests(
        server,
        endpoint,
        { validIds, invalidIds, fields }
    );
});