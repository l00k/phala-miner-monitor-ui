<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import BaseComponent from './BaseComponent.vue';

@Component
export default class AppComponent
    extends BaseComponent
{
}
</script>

<style lang="scss" src="@/assets/scss/app.scss"/>
