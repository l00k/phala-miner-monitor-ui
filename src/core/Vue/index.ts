import Vue from 'vue';
import numeral from 'numeral';
import { formatDate, formatDatetime, formatTime, ucfirst } from '@/core/Utility';


Vue.filter('ucfirst', ucfirst);
Vue.filter('formatDate', formatDate);
Vue.filter('formatTime', formatTime);
Vue.filter('formatDatetime', formatDatetime);

Vue.filter('consoleLog', function() {
    console.log(...arguments);
});

// app specific
// todo maybe shuold be loaded from module?

Vue.filter('formatCoin', function(value) {
    return numeral(value / 1000000000000.0).format('0.00 a') + 'PHA';
});

Vue.filter('formatAddress', function(value) {
    if (!value) {
        return '';
    }
    return value.substr(0, 6) + '...' + value.substr(-6);
});
