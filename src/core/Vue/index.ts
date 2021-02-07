import Vue from 'vue';
import { formatDate, formatDatetime, formatTime, ucfirst } from '@/core/Utility';


Vue.filter('ucfirst', ucfirst);
Vue.filter('formatDate', formatDate);
Vue.filter('formatTime', formatTime);
Vue.filter('formatDatetime', formatDatetime);

Vue.filter('consoleLog', function() {
    console.log(...arguments);
});
