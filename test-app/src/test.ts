// This file is required by karma.conf.js and loads all spec files
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const __karma__: any;
declare const require: any;

__karma__.loaded = function () {};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

require('./app/app.component.spec');

// Load all 107 library spec files
require('./components/ui-kit/components/accordion/accordion.spec');
require('./components/ui-kit/components/actions/action-button/action-button.spec');
require('./components/ui-kit/components/actions/actions-dropdown/actions-dropdown.spec');
require('./components/ui-kit/components/alert-footer/alert-footer.spec');
require('./components/ui-kit/components/alert/alert.spec');
require('./components/ui-kit/components/badge/badge.component.spec');
require('./components/ui-kit/components/banner/banner.spec');
require('./components/ui-kit/components/breadcrumbs/breadcrumbs.spec');
require('./components/ui-kit/components/comments/comment/comment.spec');
require('./components/ui-kit/components/comments/comments.spec');
require('./components/ui-kit/components/data-table/data-source.sample.spec');
require('./components/ui-kit/components/data-table/data-table.spec');
require('./components/ui-kit/components/data-table/data.sample.spec');
require('./components/ui-kit/components/download/download.spec');
require('./components/ui-kit/components/header-next/header.spec');
require('./components/ui-kit/components/header/header.component.spec');
require('./components/ui-kit/components/history/history.spec');
require('./components/ui-kit/components/image/image.spec');
require('./components/ui-kit/components/modal/modal.spec');
require('./components/ui-kit/components/multiselect-dropdown/multiselect-dropdown.spec');
require('./components/ui-kit/components/page-title/page-title.spec');
require('./components/ui-kit/components/pagination/pagination.spec');
require('./components/ui-kit/components/point-of-contact/point-of-contact.spec');
require('./components/ui-kit/components/sidenav/menu-item/menu-item.spec');
require('./components/ui-kit/components/sidenav/sidenav/sidenav.spec');
require('./components/ui-kit/components/spinner/spinner.spec');
require('./components/ui-kit/components/tabs/tabs.spec');
require('./components/ui-kit/directives/click-outside/click-outside.spec');
require('./components/ui-kit/directives/drag-drop/drag-drop.spec');
require('./components/ui-kit/directives/external-link/external-link.spec');
require('./components/ui-kit/directives/focus/focus.spec');
require('./components/ui-kit/directives/sticky/sticky.spec');
require('./components/ui-kit/directives/tab-outside/taboutside.spec');
require('./components/ui-kit/elements/button/button.spec');
require('./components/ui-kit/experimental/alert/alert.spec');
require('./components/ui-kit/experimental/button-next/button.spec');
require('./components/ui-kit/experimental/date-range-v2/date-range-v2.component.spec');
require('./components/ui-kit/experimental/date-range-v2/datepicker/calendar.spec');
require('./components/ui-kit/experimental/date-range-v2/datepicker/picker.spec');
require('./components/ui-kit/experimental/dollar/dollar.spec');
require('./components/ui-kit/experimental/hierarchical/autocomplete/autocomplete.component.spec');
require('./components/ui-kit/experimental/hierarchical/hierarchical-test-service.spec');
require('./components/ui-kit/experimental/hierarchical/hierarchical-tree-grid/hierarchical-tree-grid.component.spec');
require('./components/ui-kit/experimental/hierarchical/hierarchical-tree-header/hierarchical-tree-header.component.spec');
require('./components/ui-kit/experimental/hierarchical/hierarchical-tree/hierarchical-tree.component.spec');
require('./components/ui-kit/experimental/hierarchical/hierarchical/hierarchical.component.spec');
require('./components/ui-kit/experimental/hierarchical/selected-result/selected-result.component.spec');
require('./components/ui-kit/experimental/input-mask/input-mask.spec');
require('./components/ui-kit/experimental/listbox/listbox.component.spec');
require('./components/ui-kit/experimental/progress/progress.spec');
require('./components/ui-kit/experimental/sideNavigationToolbar/sideNavigationToolbar/sideNavigationToolbar.component.spec');
require('./components/ui-kit/experimental/sideNavigationToolbar/sideNavigationToolbarItem/sideNavigationToolbarItem.component.spec');
require('./components/ui-kit/filters/filters.spec');
require('./components/ui-kit/form-controls/autocomplete-multiselect/autocomplete-cache.spec');
require('./components/ui-kit/form-controls/autocomplete-multiselect/autocomplete-multiselect.spec');
require('./components/ui-kit/form-controls/autocomplete/autocomplete.spec');
require('./components/ui-kit/form-controls/date-range/date-range.spec');
require('./components/ui-kit/form-controls/date-time/date-time.spec');
require('./components/ui-kit/form-controls/date/date.spec');
require('./components/ui-kit/form-controls/number/number.spec');
require('./components/ui-kit/form-controls/radiobutton/radiobutton.spec');
require('./components/ui-kit/form-controls/sam-form-control/sam-form-control.spec');
require('./components/ui-kit/form-controls/sam-sds-autocomplete/autocomplete-search/autocomplete-seach-test-service.spec');
require('./components/ui-kit/form-controls/sam-sds-autocomplete/autocomplete-search/autocomplete-search.component.spec');
require('./components/ui-kit/form-controls/sam-sds-autocomplete/autocomplete/autocomplete.component.spec');
require('./components/ui-kit/form-controls/sam-sds-autocomplete/selected-result/selected-result.component.spec');
require('./components/ui-kit/form-controls/select/select.spec');
require('./components/ui-kit/form-controls/text/text.spec');
require('./components/ui-kit/form-controls/textarea/textarea.spec');
require('./components/ui-kit/form-controls/time/time.spec');
require('./components/ui-kit/form-controls/toggle-switch/toggle-switch.spec');
require('./components/ui-kit/form-controls/upload-v2/upload-v2.spec');
require('./components/ui-kit/form-controls/upload/upload.spec');
require('./components/ui-kit/form-templates/international-phone/international.spec');
require('./components/ui-kit/form-templates/international-phone/sam-extension/extension.spec');
require('./components/ui-kit/form-templates/international-phone/sam-international-prefix/international-prefix.spec');
require('./components/ui-kit/form-templates/international-phone/sam-telephone/telephone.spec');
require('./components/ui-kit/form-templates/name-entry/name-entry.spec');
require('./components/ui-kit/form-templates/phone-entry/phone-entry.spec');
require('./components/ui-kit/layout-deprecated/form-only-page.spec');
require('./components/ui-kit/layout-deprecated/grid/column.spec');
require('./components/ui-kit/layout-deprecated/grid/grid.spec');
require('./components/ui-kit/layout-deprecated/grid/row.spec');
require('./components/ui-kit/layout-deprecated/list-results-message.spec');
require('./components/ui-kit/layout-deprecated/page.service.spec');
require('./components/ui-kit/layout-deprecated/page.spec');
require('./components/ui-kit/layout-deprecated/pages/form-step.spec');
require('./components/ui-kit/layout-deprecated/results.spec');
require('./components/ui-kit/layout-deprecated/sidebar.spec');
require('./components/ui-kit/layout-deprecated/title-and-section.spec');
require('./components/ui-kit/layout-deprecated/workspace/workspace-template.spec');
require('./components/ui-kit/layout/filters-wrapper/filter-wrapper.spec');
require('./components/ui-kit/layout/footer/footer.component.spec');
require('./components/ui-kit/layout/header/header.component.spec');
require('./components/ui-kit/layout/header/top-banner/top-banner.component.spec');
require('./components/ui-kit/layout/page/pagination.component.spec');
require('./components/ui-kit/layout/pagination/pagination.component.spec');
require('./components/ui-kit/layout/toolbar/aside-toggle.spec');
require('./components/ui-kit/layout/toolbar/toolbar.spec');
require('./components/ui-kit/pipes/date-time-display/date-time-display.pipe.spec');
require('./components/ui-kit/pipes/filesize/filesize.pipe.spec');
require('./components/ui-kit/pipes/short-date/short-date.pipe.spec');
require('./components/ui-kit/utilities/are-equal/are-equal.spec');
require('./components/ui-kit/utilities/key-helper/key-helper.spec');
require('./components/ui-kit/utilities/pipe/pipe.spec');
require('./components/ui-kit/wrappers/fieldset-wrapper/fieldset-wrapper.spec');
require('./components/ui-kit/wrappers/label-wrapper/label-wrapper.spec');

__karma__.start();
