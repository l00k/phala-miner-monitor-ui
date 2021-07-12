<template>
    <b-modal
        :active.sync="isModalVisible"
        :width="1200"
    >
        <div class="stats">
            <ui-block title="Payout target stats">
                <template>
                    <div class="stats__chart-outer">
                        <canvas
                            id="pts-chart"
                            :key="key"
                        ></canvas>
                    </div>
                </template>
            </ui-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Account from '#/Monitor/Domain/Model/Account';
import Miner from '#/Monitor/Domain/Model/Miner';
import Repository from '@/core/Store/Repository';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import Chart from 'chart.js';
import Color from 'color';
import moment from 'moment';
import numbro from 'numbro';
import { Ref } from 'vue-property-decorator';


type ChartData = {
    [key : number]: {
        label: string,
        raw: number,
        formatted: string,
    }
}

@Component()
export default class PayoutTargetStatsView
    extends BaseComponent
{

    protected isModalVisible : boolean = false;

    protected payoutTarget : Account;

    protected miners : Miner[] = [];

    protected chart : Chart;

    protected chartData : ChartData = {};

    protected key = 0;


    public show(payoutTarget : Account)
    {
        ++this.key;
        this.chart = null;

        const minerRepository = Repository.get(Miner);

        this.payoutTarget = payoutTarget;
        this.miners = minerRepository.findAll<Miner>()
            .filter(miner => miner.isVisible)
            .filter(miner => miner.payoutTarget.address === payoutTarget.address);

        this.isModalVisible = true;

        setTimeout(() => this.renderChart());
    }

    protected renderChart()
    {
        this.chartData = {};
        this.miners.forEach((miner, idx) => {
            this.chartData[idx] = {
                label: miner.name || miner.controllerAccount.address,
                raw: miner.fireMined,
                formatted: '',
            };
        });

        for (const idx in this.chartData) {
            this.chartData[idx].raw = this.chartData[idx].raw / 1000000000000.0;
            this.chartData[idx].formatted = numbro(this.chartData[idx].raw).format('0.00 a') + 'PHA';
        }

        if (!this.chart) {
            const ctx : HTMLCanvasElement = <any> document.getElementById('pts-chart');
            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Fire mined',
                            data: [],
                            backgroundColor: this.createColors(this.miners.length),
                            borderWidth: 1,
                        }
                    ],
                },
                options: {
                    responsive: true,
                    aspectRatio: 1.4,
                    cutoutPercentage: 50,
                    tooltips: {
                        callbacks: {
                            label: (item) => {
                                return this.chartData[item.index].label + ' - ' + this.chartData[item.index].formatted;
                            }
                        }
                    }
                }
            });
        }

        this.chart.data.labels = Object.values(this.chartData).map(record => record.label);
        this.chart.data.datasets[0].data = Object.values(this.chartData).map(record => record.raw);
        this.chart.update();
    }

    protected createColors(num : number)
    {
        const colors = [];

        let base = Color.rgb(0, 255, 0);
        const arc = 360 / num;

        for (let i = 0; i < num; ++i) {
            colors.push(base.hex());
            base = base.rotate(arc);
        }

        return colors;
    }

}
</script>

<style lang="scss">
.stats {
    &__chart-outer {
        width: 100%;

        canvas {
            width: 100%;
        }
    }
}
</style>
