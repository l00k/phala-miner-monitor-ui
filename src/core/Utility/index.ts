import moment from 'moment';


function ucfirst(str : string)
{
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

function formatDate(date : Date)
{
    return moment(date).format('YYYY-MM-DD');
}

function formatTime(date : Date)
{
    return moment(date).format('HH:mm:ss');
}

function formatDatetime(date : Date)
{
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export {
    ucfirst,
    formatDate,
    formatTime,
    formatDatetime,
};
