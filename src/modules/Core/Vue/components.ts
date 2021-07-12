import UiBlock from '#/Core/Component/UI/Block.vue';
import UiFilterRange from '#/Core/Component/UI/FilterField/FilterRange.vue';
import UiFilterSelect from '#/Core/Component/UI/FilterField/FilterSelect.vue';
import UiFilterText from '#/Core/Component/UI/FilterField/FilterText.vue';
import UiTable from '#/Core/Component/UI/Table/Table.vue';
import UiTableColumn from '#/Core/Component/UI/Table/TableColumn.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ValidationProvider, ValidationObserver } from 'vee-validate';


export default {
    // Icons
    'fa-icon': FontAwesomeIcon,

    // UI
    'ui-block': UiBlock,

    'ui-filter-range': UiFilterRange,
    'ui-filter-text': UiFilterText,
    'ui-filter-select': UiFilterSelect,

    'ui-table': UiTable,
    'ui-table-column': UiTableColumn,

    // Validator
    'validate-provider': ValidationProvider,
    'validate-observer': ValidationObserver,
};
