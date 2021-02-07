import AbstractService from '@/core/Service/AbstractService';
import { Singleton } from '@100k/intiv/ObjectManager';
import { ApolloClient, NormalizedCacheObject, InMemoryCache, gql } from '@apollo/client';


export type SubscanResult = {
    code : number,
    message : string,
    ttl : number,
    data : {
        [index : string] : any
    }
};


@Singleton()
export default class MonitorApi
{

    protected static readonly BASE_URL : string = '';

    protected graphQlApi : ApolloClient<NormalizedCacheObject>;

    constructor()
    {
        if (!MonitorApi.BASE_URL) {
            throw Error('Base URL has to be defined in Service class');
        }

        this.graphQlApi = new ApolloClient({
            uri: 'http://localhost:8080/graphq/',
            cache: new InMemoryCache(),
        });
    }

    public async getAccounts(accounts : string[] = []) : Promise<Account[]>
    {
        const rawData = await this.graphQlApi.query({
            query: gql`getAccounts(addresses: ["4281YSs23igo3TVMDFezHMgrAN4pzRBKDi6sN6Zr9MjpNA4j"]) Account`
        });


        return [];
    }

}
