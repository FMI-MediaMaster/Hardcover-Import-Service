import fetch from 'node-fetch';
import config from '@media-master/load-dotenv';
import errors from '@media-master/http-errors';
import {
    Query,
    ResponseBody,
    BookInfo,
    UserBooksResponse,
} from '@types';


export default class HardcoverService {
    private readonly headers: Record<string, string>;

    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.HARDCOVER_ACCESS_TOKEN}`,
        };
    };

    private request = async <T>(query: string): Promise<T | undefined> => {
        const url = new URL('https://api.hardcover.app/v1/graphql');
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ 'query': query }),
        });

        if (!response.ok) return undefined;

        return ((await response.json() as ResponseBody)['data']) as T;
    };


    private getImport = async (userId: string): Promise<BookInfo[]> => {
        const query = `
            query {
                user_books(
                    where: { user_id: { _eq: ${userId} } }
                    distinct_on: book_id
                ) {
                    book {
                        title
                    }
                }
            }
        `;

        const data = await this.request<UserBooksResponse>(query);
        return data?.user_books.map((item) => ({ name: item.book.title })) ?? [];
    };

    public handle = async (method: string, query: Query): Promise<unknown> => {
        const methodMap: Record<string, (param: string) => Promise<unknown>> = {
            import: this.getImport,
        };

        if (!(method in methodMap)) {
            throw errors.notFound(
                'Invalid endpoint! Use /[import]'
            );
        }

        const param = query['id'];
        if (param === undefined) throw errors.badRequest(`Missing parameter for the ${method} endpoint`);

        return await methodMap[method](param);
    };
}