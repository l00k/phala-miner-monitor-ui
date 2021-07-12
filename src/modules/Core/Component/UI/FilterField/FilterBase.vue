<script lang="ts">
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Initialize, Initializable, Property } from '@100k/intiv/Initializable/index';
import numbro from 'numbro';
import { Prop, Watch } from 'vue-property-decorator';


@Initialize()
export class FilterConfig
    extends Initializable<FilterConfig>
{

    @Property()
    public numberFormat? : string;

    @Property()
    public unserialize? : Function;

}

export default abstract class UiFilterBase
    extends BaseComponent
{

    @Prop({ default: () => new FilterConfig() })
    public config : Partial<FilterConfig>;

    @Prop({ default: false })
    public numeric : boolean;

    @Prop()
    public filter : any;

    public rawValue : any = {};


    public mounted()
    {
        this.onFilterChange();
    }

    public clear()
    {
        Object.keys(this.filter)
            .forEach(key => {
                this.$delete(this.filter, key);
            });
    }

    @Watch('filter', { deep: true })
    public onFilterChange()
    {
        if (!this.filter) {
            return;
        }

        Object.keys(this.rawValue)
            .forEach(operator => {
                if (this.numeric) {
                    this.rawValue[operator] = typeof this.filter[operator] != 'number'
                        ? ''
                        : this.config.numberFormat
                            ? numbro(this.filter[operator]).format(this.config.numberFormat)
                            : this.filter[operator];
                }
                else {
                    this.rawValue[operator] = this.filter[operator];
                }
            });

        (<any>this.rawValue).__ob__.dep.notify();
    }

    public onRawValueChange()
    {
        if (!this.rawValue) {
            return;
        }

        Object.keys(this.rawValue)
            .forEach(operator => {
                if (this.numeric) {
                    this.filter[operator] = this.rawValue[operator] === ''
                        ? undefined
                        : this.config.numberFormat
                            ? numbro.unformat(this.rawValue[operator], this.config.numberFormat)
                            : +this.rawValue[operator];
                }
                else {
                    this.filter[operator] = this.rawValue[operator];
                }

                if (this.config.unserialize) {
                    if (this.filter[operator]) {
                        this.filter[operator] = this.config.unserialize(this.filter[operator]);
                    }
                }
            });

        this.filter.__ob__.dep.notify();
    }

}
</script>
