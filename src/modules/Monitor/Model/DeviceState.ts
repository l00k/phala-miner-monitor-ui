import { Model, AbstractModel } from '@/core/Store';
import { Property, Initializable } from '@100k/intiv/Initializable';


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

    public get cpuTag() : TagProps
    {
        const temperature = this.cpu.temperature;
        return {
            type: temperature < 60
                ? 'is-success'
                : temperature < 80
                    ? 'is-warning'
                    : 'is-danger',
            hint: `Temp: ${ temperature.toFixed(1) }°C`,
        };
    }

    public get nodeTag() : TagProps
    {
        let hint : string = <any> this.node.state;

        if (this.node.state === ContainerState.InSync) {
            hint += ` / Progress: ${ this.node.syncProgress.toFixed(1) }%`;
        }

        return {
            type: containerStateToTagTypeMap[this.node.state],
            hint: hint,
        };
    }

    public get runtimeTag() : TagProps
    {
        return {
            type: containerStateToTagTypeMap[this.runtime.state],
            hint: this.runtime.state,
        };
    }

    public get hostTag() : TagProps
    {
        return {
            type: containerStateToTagTypeMap[this.host.state],
            hint: this.host.state,
        };
    }

    public constructor(data? : Partial<DeviceState>)
    {
        super();
        this.setData(data);
    }

}
