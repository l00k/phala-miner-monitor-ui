import { Configuration } from '@100k/intiv/Configuration';
import { ObjectManager } from '@100k/intiv/ObjectManager';
import ApolloClient from 'apollo-boost';
import Clipboard from 'clipboard';
import { ToastProgrammatic as Toast } from 'buefy';

declare const window;

export default {
    apollo: () => {
        return new ApolloClient({
            uri: window.appData.apiUrl,
        })
    },
    clipboard: () => {
        const clipboard = new Clipboard('.js-clipboard');

        clipboard.on('success', function(e) {
            Toast.open({
                message: 'Copied!',
                type: 'is-success',
                position: 'is-bottom-right',
            });
        });

        return clipboard;
    }
};
