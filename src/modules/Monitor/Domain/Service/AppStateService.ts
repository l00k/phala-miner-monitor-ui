import AppState from '#/Monitor/Domain/Model/AppState';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import { Inject } from '@100k/intiv/ObjectManager';
import gql from 'graphql-tag';


export default class AppStateService
{

    @Inject()
    protected monitorApi : MonitorApi;

    public async get() : Promise<AppState>
    {
        const { appStateRaw } = await this.monitorApi.query(gql`
            query { 
                appStateRaw: getAppState { 
                    data 
                } 
            }
        `);

        return new AppState(JSON.parse(appStateRaw.data));
    }

}
