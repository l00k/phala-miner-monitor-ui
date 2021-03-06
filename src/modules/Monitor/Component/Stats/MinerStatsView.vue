<template>
    <b-modal
        :active.sync="isModalVisible"
        :width="1200"
    >
        <div class="stats">
            <ui-block title="Miner stats">
                <template>
                    <b-field
                        label-position="on-border"
                        label="Group By"
                    >
                        <b-select
                            v-model="groupBy"
                            placeholder="Group By"
                            size="is-small"
                            @input="renderChart"
                        >
                            <option :value="DateTimeInterval.H1">Hour</option>
                            <option :value="DateTimeInterval.D1">Day</option>
                            <option :value="DateTimeInterval.W1">Week</option>
                            <option :value="DateTimeInterval.M1">Month</option>
                        </b-select>
                    </b-field>

                    <div class="stats__chart-outer">
                        <div
                            class="stats__chart-inner"
                            :style="{ width: (chartWidth + 'px') }"
                        >
                            <canvas
                                id="ms-chart"
                                height="300"
                                width="0"
                                :key="key"
                            ></canvas>
                        </div>
                    </div>
                </template>
            </ui-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import DateTimeInterval from '#/Monitor/Domain/Model/DateTimeInterval';
import Miner from '#/Monitor/Domain/Model/Miner';
import Reward, { PayoutReason } from '#/Monitor/Domain/Model/Reward';
import RewardChunk from '#/Monitor/Domain/Model/RewardChunk';
import RewardChunkService from '#/Monitor/Domain/Service/RewardChunkService';
import MonitorApi from '#/Monitor/Service/MonitorApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager';
import Chart from 'chart.js';
import moment from 'moment';
import numbro from 'numbro';


type ChartData = {
    [key : string]: {
        raw: number,
        format?: string,
        date?: Date,
    }
}


@Component()
export default class MinerStatsView
    extends BaseComponent
{

    protected DateTimeInterval : typeof DateTimeInterval = DateTimeInterval;

    protected static readonly GROUP_BY_PROPS = {
        H: {
            format: 'YYYY-MM-DD HH',
            step: 3600000,
        },
        D: {
            format: 'YYYY-MM-DD',
            step: 86400000,
        },
        W: {
            format: 'YYYY-WW',
            step: 604800000,
        },
        M: {
            format: 'YYYY-MM',
            step: 2592000000,
        },
    };

    @Inject()
    protected rewardChunkService : RewardChunkService;

    protected isModalVisible : boolean = false;

    protected miner : Miner;

    protected rewards : RewardChunk[] = [];

    protected groupBy : DateTimeInterval = DateTimeInterval.D1;

    protected chartData : ChartData[];
    protected chartLabels : string[] = [];

    protected chart : Chart;

    protected key = 0;


    protected get chartWidth() : number
    {
        return this.chartLabels.length * 20;
    }


    public async show(miner : Miner)
    {
        ++this.key;
        this.chart = null;

        this.miner = miner;
        this.rewards = await this.rewardChunkService.find({
            minerId: miner.id,
            groupBy: this.groupBy,
        });

        this.isModalVisible = true;

        setTimeout(() => this.renderChart());
    }

    protected renderChart()
    {
        const groupBy = this.groupBy.substring(0, 1);

        const groupFormat = MinerStatsView.GROUP_BY_PROPS[groupBy].format;
        const dateStep = MinerStatsView.GROUP_BY_PROPS[groupBy].step;

        // find oldest entry
        let oldestEntry : Date = new Date();
        this.rewards.forEach(entry => {
            if (entry.date < oldestEntry) {
                oldestEntry = entry.date;
            }
        });

        oldestEntry = moment(oldestEntry).subtract(dateStep).toDate();

        // create inital values
        this.chartData = [ {}, {} ];

        let currentDate = moment().toDate();
        while (oldestEntry < currentDate) {
            const key = moment(currentDate).format(groupFormat);

            this.chartData[0][key] = { raw: 0 };
            this.chartData[1][key] = { raw: 0 };

            currentDate = moment(currentDate).subtract(dateStep, 'ms').toDate();
        }

        this.rewards
            .forEach(reward => {
                const datasetKey = reward.reason === PayoutReason.Online ? 0 : 1;
                const key = moment(reward.date).format(groupFormat);
                this.chartData[datasetKey][key].raw += parseInt(reward.rewardValue.toString(10));
            });

        for (const dataset of this.chartData) {
            for (const idx in dataset) {
                dataset[idx].raw = dataset[idx].raw / 1000000000000.0;
                dataset[idx].format = numbro(dataset[idx].raw).format('0.00 a') + 'PHA';
            }
        }

        if (!this.chart) {
            const ctx : HTMLCanvasElement = <any> document.getElementById('ms-chart');
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Online reward',
                            data: [],
                            backgroundColor: '#3298dc',
                            borderColor: '#1278bc',
                            borderWidth: 1,
                        },
                        {
                            label: 'Compute reward',
                            data: [],
                            backgroundColor: '#48c774',
                            borderColor: '#28a754',
                            borderWidth: 1,
                        }
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [ { stacked: true } ],
                        yAxes: [ { type: 'logarithmic', stacked: true, } ],
                    },
                    tooltips: {
                        callbacks: {
                            label: (item) => {
                                return this.chartData[item.datasetIndex][item.label].format;
                            }
                        }
                    }
                }
            });
        }

        this.chartLabels = Object.keys(this.chartData[0]).reverse();
        this.chart.data.labels = this.chartLabels;
        this.chart.data.datasets[0].data = Object.values(this.chartData[0]).reverse().map(record => record.raw);
        this.chart.data.datasets[1].data = Object.values(this.chartData[1]).reverse().map(record => record.raw);
        this.chart.update();
    }

}
</script>

<style lang="scss">
.stats {
    &__chart-outer {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: auto;
    }
    &__chart-inner {
        height: 600px;
        min-width: 100%;

        canvas {
            width: 100% !important;
        }
    }
}
</style>
