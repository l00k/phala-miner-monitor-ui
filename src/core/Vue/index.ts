import Vue from 'vue';
import { empty, isset } from '@100k/intiv-js-tools/Utility';
import { formatDate, formatDatetime, formatTime, ucfirst } from '@/core/Utility';


Vue.filter('isset', isset);
Vue.filter('empty', empty);
Vue.filter('ucfirst', ucfirst);
Vue.filter('formatDate', formatDate);
Vue.filter('formatTime', formatTime);
Vue.filter('formatDatetime', formatDatetime);

Vue.filter('consoleLog', function() {
    console.log(...arguments);
});
