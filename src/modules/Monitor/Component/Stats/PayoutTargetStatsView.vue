<template>
    <b-modal
        :active.sync="isModalVisible"
        :width="600"
    >
        <div class="stats">
            <be-block title="Payout target stats">
                <template>
                    <Pie ref="chart"/>
                </template>
            </be-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Account from '#/Monitor/Model/Account';
import Miner from '#/Monitor/Model/Miner';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Pie } from 'vue-chartjs';
import { Ref } from 'vue-property-decorator';
import Color from 'color';
import numeral from 'numeral';


@Component({
    components: {
        Pie
    }
})
export default class PayoutTargetStatsView
    extends BaseComponent
{

    @Ref('chart')
    protected $chart : Pie;

    protected isModalVisible : boolean = false;

    protected payoutTarget : Account;

    protected miners : Miner[] = [];

    public show(payoutTarget : Account)
    {
        this.payoutTarget = payoutTarget;
        this.miners = Miner.findAll<Miner>()
            .filter(miner => miner.isVisible)
            .filter(miner => miner.payoutTarget.address === payoutTarget.address);

        this.isModalVisible = true;

        setTimeout(() => this.renderChart());
    }

    protected renderChart()
    {
        const chartData = {
            labels: this.miners.map(miner => miner.name || miner.controllerAccount.address),
            datasets: [
                {
                    label: 'Fire mined',
                    data: this.miners.map(miner => miner.fireMined),
                    borderWidth: 1,
                    backgroundColor: this.createColors(this.miners.length),
                }
            ],
        };

        const chartOptions = {
            responsive: true,
            cutoutPercentage: 50,
            tooltips: {
                callbacks: {
                    label(item) {
                        let label = chartData.labels[item.index];
                        const value = chartData.datasets[0].data[item.index];
                        label += ' - ' + numeral(value / 1000000000000.0).format('0.00 a') + 'PHA';
                        return label;
                    }
                }
            }

        }

        this.$chart.renderChart(chartData, chartOptions);
    }

    protected createColors(num : number)
    {
        const colors = [];

        let base = Color.rgb(0,255,0);
        const arc = 360 / num;

        for (let i=0; i<num; ++i) {
            colors.push(base.hex());
            base = base.rotate(arc);
        }

        return colors;
    }

}
</script>
