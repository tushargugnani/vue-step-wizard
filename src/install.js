import FormWizard from "./components/FormWizard.vue";
import TabContent from "./components/TabContent.vue";
import ValidationHelper from './components/ValidationHelper.vue';

const VueStepWizard = {
 install(Vue) {
  // Let's register our component globally
  // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("form-wizard", FormWizard);
    Vue.component("tab-content", TabContent);
 }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueStepWizard);
}

export default VueStepWizard
export {
    FormWizard,
    TabContent,
    ValidationHelper
  }