import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { ToastProgrammatic as Toast } from 'buefy';
import Clipboard from 'clipboard';


declare const window;

export default {
    apollo: () => {
        return new ApolloClient({
            uri: window.appData.apiUrl,
            cache: new InMemoryCache()
        });
    },
    clipboard: () => {
        document.onload = function() {
            const clipboard = new Clipboard('.js-clipboard');

            clipboard.on('success', function(e) {
                Toast.open({
                    message: 'Copied!',
                    type: 'is-success',
                    position: 'is-bottom-right',
                });
            });
        }
    }
};
