import { formatDate, formatDatetime, formatTime, ucfirst } from '@/core/Utility';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import numeral from 'numeral';
import Vue from 'vue';

/*
 * EXTERNAL COMPONENTS
 */
Vue.component('fa-icon', FontAwesomeIcon);

/*
 * FILTERs
 */
Vue.filter('ucfirst', ucfirst);
Vue.filter('formatDate', formatDate);
Vue.filter('formatTime', formatTime);
Vue.filter('formatDatetime', formatDatetime);

Vue.filter('consoleLog', function() {
    console.log(...arguments);
});

Vue.filter('formatNumber', function(value, format) {
    return numeral(value).format(format);
});

/*
 * APP SPECIFIC
 */
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
