import { Model, AbstractModel } from '@/core/Store';
import { Property } from '@100k/intiv/Initializable';


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
{

    public state? : ContainerState = ContainerState.NotRunning;

    public syncProgress? : number = 0;

    public temperature? : number = 0;

}


type TagProps = {
    type : string,
    hint : string,
}

@Model('Monitor/DeviceState')
export default class DeviceState
    extends AbstractModel<DeviceState>
{

    @Property()
    public cpu : PartInfo = new PartInfo();

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
            const progress = (this.node.syncProgress * 100).toFixed(2);
            hint += `\nProgress: ${ progress }%`;
        }

        return {
            type: containerStateToTagTypeMap[this.node.state],
            hint: hint,
        };
    }

    public get runtimeTag() : TagProps
    {
        let hint : string = <any> this.node.state;
        return {
            type: containerStateToTagTypeMap[this.node.state],
            hint: hint,
        };
    }

    public get hostTag() : TagProps
    {
        let hint : string = <any> this.node.state;
        return {
            type: containerStateToTagTypeMap[this.node.state],
            hint: hint,
        };
    }

    public constructor(data? : Partial<DeviceState>)
    {
        super();
        this.setData(data);
    }

}
