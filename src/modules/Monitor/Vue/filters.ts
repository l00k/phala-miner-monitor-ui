import numbro from 'numbro';


export default {
    formatCoin(value : any)
    {
        return numbro(value / 1000000000000.0).format('0.00 a') + 'PHA';
    },

    formatAddress(value : any)
    {
        if (!value) {
            return '';
        }
        return value.substr(0, 6) + '...' + value.substr(-6);
    },
};
