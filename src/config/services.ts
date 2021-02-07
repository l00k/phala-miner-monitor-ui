import { Configuration } from '@100k/intiv/Configuration';
import { ObjectManager } from '@100k/intiv/ObjectManager';
import ApolloClient from 'apollo-boost';
import Clipboard from 'clipboard';
import { ToastProgrammatic as Toast } from 'buefy';

export default {
    apollo: () => {
        const configuration = ObjectManager.getInstance(Configuration);
        return new ApolloClient({
            uri: configuration.get<string>('apollo.uri'),
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
