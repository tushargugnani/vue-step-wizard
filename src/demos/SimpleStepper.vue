<template>
    <form-wizard ref="formwizard" @onComplete="onComplete" @onNextStep="nextStep" @onPreviousStep="previousStep" @onReset="reset">
        <tab-content title="About You" :selected="true">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" class="form-control" :class="hasError('fullName') ? 'is-invalid' : ''" placeholder="Enter your name" v-model="formData.fullName">
                <div v-if="hasError('fullName')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.fullName.required">Please provide a valid name.</div>
                </div>
            </div>
            <div class="form-group">
                <label for="email">Your Email</label>
                <input type="email" class="form-control" :class="hasError('email') ? 'is-invalid' : ''" placeholder="Enter your email" v-model="formData.email">
                <div v-if="hasError('email')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.email.required">Email field is required</div>
                    <div class="error" v-if="!$v.formData.email.email">Should be in email format</div>
                </div>
            </div>
        </tab-content>
        <tab-content title="About your Company"> 
            <div class="form-group">
                <label for="companyName">Your Company Name</label>
                <input type="text" class="form-control" :class="hasError('companyName') ? 'is-invalid' : ''" placeholder="Enter your Company / Organization name" v-model="formData.companyName">
                <div v-if="hasError('companyName')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.companyName.required">Please provide a valid company name.</div>
                </div>
            </div>
            <div class="form-group">
                <label for="numberOfEmployees">Number of Employees</label>
                <input type="text" class="form-control" :class="hasError('numberOfEmployees') ? 'is-invalid' : ''" placeholder="Enter Total Number of Employees" v-model="formData.numberOfEmployees">
                <div v-if="hasError('numberOfEmployees')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.numberOfEmployees.required">Please provide number of employees in your company.</div>
                    <div class="error" v-if="!$v.formData.numberOfEmployees.numeric">Should be a valid value.</div>
                </div>
            </div>
        </tab-content>
        <tab-content title="Finishing Up">
            <div class="form-group">
                <label for="referral">From Where did you hear about us</label>
                <select :class="hasError('referral') ? 'is-invalid' : ''" class="form-control" v-model="formData.referral">
                    <option>Newspaper</option>
                    <option>Online Ad</option>
                    <option>Friend</option>
                    <option>Other</option>
                </select>
                <div v-if="hasError('referral')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.referral.required">Please select on of the fields.</div>
                </div>
            </div>
            <div class="form-group form-check">
                <input type="checkbox" :class="hasError('terms') ? 'is-invalid' : ''" class="form-check-input" v-model="formData.terms">
                <label class="form-check-label">I accpet terms & conditions</label>
                <div v-if="hasError('terms')" class="invalid-feedback">
                    <div class="error" v-if="!$v.formData.terms.required">Please select terms and conditions.</div>
                </div>
            </div>
        </tab-content>
    </form-wizard>
</template>

<script>
import FormWizard from '../components/FormWizard.vue';
import TabContent from '../components/TabContent.vue';
import ValidationHelper from '../components/ValidationHelper.vue';
import { required } from 'vuelidate/lib/validators';
import { email } from 'vuelidate/lib/validators';
import { numeric } from 'vuelidate/lib/validators';
const checked = (value) => value === true;

export default {
    name: 'SimpleStepper',
    components: {
        FormWizard, TabContent
    },
    mixins: [ValidationHelper],
    data(){
        return {
            formData:{
                fullName: '',
                email: null,
                companyName: null,
                numberOfEmployees: null,
                referral: null,
                terms: false,
            },
            validationRules:[
                {fullName: {required}, email: {required, email} },
                {companyName: {required}, numberOfEmployees: {required, numeric} },
                {referral: {required}, terms: {checked} }
            ]
        }
    },
    methods:{
        onComplete(){
            alert("Submitting Form ! Rock On");
            this.$refs.formwizard.changeStatus();
        },

        reset(){
            for(let field in this.formData){
                this.formData[field] = null;
            }
        },

        nextStep(){
            //alert("On Next Step");
        },

        previousStep(){
            //alert("On Previous Step");
        }
    }
}
</script>