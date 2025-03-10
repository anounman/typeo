export const apiConfig = {
    baseUrl: import.meta.env.VITE_API_URL as string,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json",
    },

}



export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
}