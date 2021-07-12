import PayoutTargetSecretKeyData from '#/Monitor/Dto/PayoutTargetSecretKeyData';
import Account, { Fragments as AccountFragments } from '#/Monitor/Domain/Model/Account';
import Miner, { Fragments as MinerFragments } from '#/Monitor/Domain/Model/Miner';
import AppState from '#/Monitor/Domain/Model/AppState';
import { Inject } from '@100k/intiv/ObjectManager';
import { ApolloClient, InMemoryCache, DocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';


type Variables = {
    [variable: string]: any
};


export default class MonitorApi
{

    @Inject('apollo')
    protected apollo : ApolloClient<InMemoryCache>;


    public async query(
        query : DocumentNode,
        variables : Variables = {}
    ) : Promise<any>
    {
        const { data } = await this.apollo.query({ query, variables });
        if (!data) {
            return [];
        }

        return data;
    }

    public async mutate(
        mutation : DocumentNode,
        variables : Variables = {}
    ) : Promise<any>
    {
        const { data } = await this.apollo.mutate({ mutation, variables });
        if (!data) {
            return [];
        }

        return data;
    }

}
