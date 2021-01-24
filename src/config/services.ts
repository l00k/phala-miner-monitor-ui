import Clipboard from 'clipboard';
import { ToastProgrammatic as Toast } from 'buefy';

export default {
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
