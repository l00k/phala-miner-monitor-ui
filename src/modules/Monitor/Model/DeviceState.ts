import { Model, AbstractModel } from '@/core/Store';
import { Property, Initializable } from '@100k/intiv/Initializable';
import moment from 'moment';


export enum ContainerState
{
    NotRunning = 'NotRunning',
    InSync = 'InSync',
    NotInitiated = 'NotInitiated',
    Running = 'Running',
}


const containerStateToTagTypeMap = {
    [ContainerState.NotRunning]: 'is-danger',
    [ContainerState.InSync]: 'is-warning',
    [ContainerState.NotInitiated]: 'is-warning',
    [ContainerState.Running]: 'is-success',
};


export class PartInfo
    extends Initializable<PartInfo>
{

    @Property()
    public state? : ContainerState = ContainerState.NotRunning;

    @Property()
    public syncProgress? : number = 0;

    @Property()
    public temperature? : number = 0;

}


type TagProps = {
    type : string,
    hint : string,
}

export default class DeviceState
    extends Initializable<DeviceState>
{

    @Property()
    public cpu : PartInfo;

    @Property()
    public node : PartInfo = new PartInfo();

    @Property()
    public runtime : PartInfo = new PartInfo();

    @Property()
    public host : PartInfo = new PartInfo();

    @Property()
    public updatedAt : Date;

    public get isOutdated() : boolean
    {
        return moment().diff(this.updatedAt, 'minutes') > 15;
    }

    public get outdatedTag() : TagProps
    {
        const hint = 'Is outdated! Last update: ' + moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss');
        return {
            type: 'is-warning',
            hint,
        };
    }

    public get cpuTag() : TagProps
    {
        const temperature = this.cpu.temperature;
        let hint : string = `Temp: ${ temperature.toFixed(1) }°C`;

        return {
            type: this.isOutdated
                ? 'is-light'
                : temperature < 60
                    ? 'is-success'
                    : temperature < 80
                        ? 'is-warning'
                        : 'is-danger',
            hint,
        };
    }

    public get nodeTag() : TagProps
    {
        let hint : string = <any> this.node.state;

        if (this.node.state === ContainerState.InSync) {
            hint += ` / Progress: ${ this.node.syncProgress.toFixed(1) }%`;
        }

        return {
            type: this.isOutdated
                ? 'is-light'
                : containerStateToTagTypeMap[this.node.state],
            hint,
        };
    }

    public get runtimeTag() : TagProps
    {
        let hint : string = <any> this.runtime.state;
        return {
            type: this.isOutdated
                ? 'is-light'
                : containerStateToTagTypeMap[this.runtime.state],
            hint,
        };
    }

    public get hostTag() : TagProps
    {
        let hint : string = <any> this.host.state;
        return {
            type: this.isOutdated
                ? 'is-light'
                : containerStateToTagTypeMap[this.host.state],
            hint,
        };
    }

    public constructor(data? : Partial<DeviceState>)
    {
        super();
        this.setData(data);
    }

}
