import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { messages } from 'vee-validate/dist/locale/en.json';
import * as rules from 'vee-validate/dist/rules';
import Vue from 'vue';


Vue.component('validate-provider', ValidationProvider);
Vue.component('validate-observer', ValidationObserver);

Object.keys(rules).forEach(rule => {
    extend(rule, {
        ...rules[rule],
        message: messages[rule]
    });
});
