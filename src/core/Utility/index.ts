import { format } from 'date-fns';


function ucfirst(str : string)
{
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

function formatDate(date : Date)
{
    return format(date, 'yyyy-MM-dd');
}

function formatTime(date : Date)
{
    return format(date, 'HH:mm:ss');
}

function formatDatetime(date : Date)
{
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export {
    ucfirst,
    formatDate,
    formatTime,
    formatDatetime,
};
