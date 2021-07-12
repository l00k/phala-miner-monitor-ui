import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoins, faHeartBroken, faCaretDown } from '@fortawesome/free-solid-svg-icons';


library.add(
    faCoins,
    faHeartBroken,
    { ...faCaretDown, iconName: <any> 'menu-down' }
);
