export class ApiSuccessResponse {
    statusCode;
    data;
    message;
    cookies;
    constructor({ statusCode = 200, message = 'Success', data, cookies, }) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.cookies = cookies;
    }
}
export class ApiErrorResponse {
    statusCode;
    name;
    message;
    error;
    constructor(error) {
        this.name = error.name;
        this.statusCode = error.statusCode;
        this.message = error.message;
        console.log(error);
        if (error.error)
            this.error = error.error;
    }
}
