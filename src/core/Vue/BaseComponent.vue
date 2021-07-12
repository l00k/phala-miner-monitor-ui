<script lang="ts">
import { ToastProgrammatic } from 'buefy';
import { BDialogConfig } from 'buefy/types/components';
import { Component, Vue } from 'vue-property-decorator';


type HandleRequestCallback = () => Promise<any>;

type HandleRequestOptions = {
    title : string,
    msgSuccess? : string,
    msgFail? : string,
};

@Component
export default class BaseComponent
    extends Vue
{

    protected componentId : string;

    public created()
    {
        const uid = 100000000000 + Math.round(Math.random() * 899999999999);
        this.componentId = 'uid' + uid;
    }

    public async handleRequest(
        callback : () => void,
        options : HandleRequestOptions
    )
    {
        options = {
            msgSuccess: 'Success',
            msgFail: 'Failed',
            ...options
        };

        try {
            let response = await callback();

            if (options.msgSuccess) {
                ToastProgrammatic.open({
                    type: 'is-success',
                    message: `<strong>${ options.title }</strong><br/>${ options.msgSuccess }`,
                });
            }
        }
        catch (e) {
            if (options.msgFail) {
                ToastProgrammatic.open({
                    type: 'is-danger',
                    message: `<strong>${ options.title }</strong><br/>${ options.msgFail }`,
                });
            }

            throw e;
        }
    }

    public async confirm(options : BDialogConfig) : Promise<boolean>
    {
        return new Promise((resolve, reject) => {
            this.$buefy.dialog.confirm({
                confirmText: 'Confirm',
                ...options,
                onConfirm()
                {
                    resolve(true);
                },
                onCancel()
                {
                    resolve(false);
                },
            });
        });
    }

}
</script>
