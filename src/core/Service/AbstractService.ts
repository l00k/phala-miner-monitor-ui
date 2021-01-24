import axios, { AxiosInstance } from 'axios';
import qs from 'qs';


class AbstractService
{

    protected static readonly BASE_URL : string;

    protected http : AxiosInstance;

    constructor()
    {
        const Class : typeof AbstractService = <any> this.constructor;

        if (!Class.BASE_URL) {
            throw Error('Base URL has to be defined in Service class');
        }

        this.http = axios.create({
            baseURL: Class.BASE_URL,
            withCredentials: true
        });

        this.http.interceptors.request.use(config => {
            config.paramsSerializer = params => {
                return qs.stringify(params, {
                    arrayFormat: 'brackets',
                    encode: true
                });
            };

            return config;
        });
    }
}


export default AbstractService;
