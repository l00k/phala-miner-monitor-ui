<template>
    <b-modal
        :active.sync="isModalVisible"
        :width="600"
    >
        <div class="stats">
            <be-block title="Miner stats">
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
                            <option value="hour">Hour</option>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </b-select>
                    </b-field>

                    <Bar ref="chart"/>
                </template>
            </be-block>
        </div>
    </b-modal>
</template>

<script lang="ts">
import Miner from '#/Monitor/Model/Miner';
import Reward, { PayoutReason } from '#/Monitor/Model/Reward';
import MonitorApi from '#/Monitor/Service/Api/MonitorApi';
import { Component } from '@/core/Vue/Annotations';
import BaseComponent from '@/core/Vue/BaseComponent.vue';
import { Inject } from '@100k/intiv/ObjectManager/index';
import Color from 'color';
import moment from 'moment';
import numeral from 'numeral';
import { Bar } from 'vue-chartjs';
import { Ref } from 'vue-property-decorator';


@Component({
    components: {
        Bar
    }
})
export default class MinerStatsView
    extends BaseComponent
{

    @Ref('chart')
    protected $chart : Bar;

    @Inject()
    protected monitorApi : MonitorApi;

    protected isModalVisible : boolean = false;

    protected miner : Miner;

    protected rewards : Reward[] = [];

    protected groupBy = 'day';


    public async show(miner : Miner)
    {
        this.miner = miner;
        this.rewards = await this.monitorApi.fetchMinerRewards(miner);

        this.isModalVisible = true;

        setTimeout(() => this.renderChart());
    }

    protected renderChart()
    {
        const groupFormat = this.groupBy === 'hour'
            ? 'YYYY-MM-DD HH'
            : this.groupBy === 'day'
                ? 'YYYY-MM-DD'
                : this.groupBy === 'week'
                    ? 'YYYY-MM-gg'
                    : 'YYYY-MM';

        let rewards = {};
        this.rewards.forEach(reward => {
            const key = moment(reward.date).format(groupFormat);
            if (!rewards[key]) {
                rewards[key] = new Reward({
                    date: reward.date,
                    fire: 0,
                });
            }

            rewards[key].fire += reward.fire;
        });

        rewards = Object.values(rewards);

        const chartData = {
            labels: rewards.map(reward => moment(reward.date).format(groupFormat)),
            datasets: [
                {
                    label: 'Fire mined',
                    data: rewards.map(reward => reward.fire / 1000000000000.0),
                    dataFormatted: rewards.map(reward => numeral(reward.fire / 1000000000000.0).format('0.00 a') + 'PHA'),
                    backgroundColor: '#48c774',
                    minBarLength: 2,
                }
            ],
        };

        const chartOptions = {
            tooltips: {
                callbacks: {
                    label(item) {
                        return chartData.datasets[0].dataFormatted[item.index];
                    }
                }
            }
        }

        this.$chart.renderChart(chartData, chartOptions);
    }

}
</script>

<style lang="scss">
.stats {
    canvas {
        width: 100%;
        height: 400px;
    }
}
</style>
