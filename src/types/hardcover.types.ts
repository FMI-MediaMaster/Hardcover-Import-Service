export interface Query {
    id?: string;
}

export interface ResponseBody {
    data?: object;
};

export interface BookInfo {
    name: string;
}

export interface UserBooksResponse {
    user_books: {
        book: {
            title: string;
        };
    }[];
}
