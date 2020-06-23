# vue-step-wizard

## Installing

### NPM
```
npm install --save vue-step-wizard
```

### Direct script Include
```
<link rel="stylesheet" href="https://unpkg.com/vue-step-wizard/dist/vue-step-wizard.css">
<script src="https://unpkg.com/vue-step-wizard/dist/vue-step-wizard.js"></script>
```

## Component Registration

### Global
```javascript
//global registration
import VueStepWizard from 'vue-step-wizard'
import 'vue-step-wizard/dist/vue-step-wizard.css'
Vue.use(VueStepWizard);
```

### Local 
```javascript
//local registration
import {FormWizard, TabContent} from 'vue-step-wizard'
import 'vue-step-wizard/dist/vue-step-wizard.css'
//component code
components: {
  FormWizard,
  TabContent
}
```


## Usage

### Basic Stepper Template

```
    <form-wizard>
        <tab-content title="About You" :selected="true">
            This is content of Tab 1
        </tab-content>
        <tab-content title="About your Company"> 
            <p>Can contains</p>
            <p>Multiple Elements</p>
        </tab-content>
        <tab-content title="Finishing Up">
            <p>Or an image .. or any thing</p>
            <img src="../assets/dog.png" alt="Simple" />
        </tab-content>  
    </form-wizard>
```

#### *Basic Stepper Demo*

<iframe
     src="https://codesandbox.io/embed/vue-step-wizard-basic-stepper-zc3mq?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue step wizard (Basic Stepper)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-autoplay"
></iframe>

### Form Stepper

It's same as building a stepper, you just need to decide which form fields goes into which tab-content component and bind it with you vue model attribute.

```javascript
<template>
    <form-wizard>
        <tab-content title="About You" :selected="true">
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" class="form-control" placeholder="Enter your name" v-model="fullName">
            </div>
        </tab-content>
        <tab-content title="About your Company"> 
            <div class="form-group">
                <label for="companyName">Your Company Name</label>
                <input type="text" class="form-control" placeholder="Enter your Company / Organization name" v-model="companyName">
            </div>
        </tab-content>
        <tab-content title="Finishing Up">
            <div class="form-group">
                <label for="referral">From Where did you hear about us</label>
                <select class="form-control" v-model="referral">
                    <option>Newspaper</option>
                    <option>Online Ad</option>
                    <option>Friend</option>
                    <option>Other</option>
                </select>
            </div>
        </tab-content>
    </form-wizard>
</template>

<script>
import {FormWizard, TabContent} from 'vue-step-wizard'
import "vue-step-wizard/dist/vue-step-wizard.css";


export default {
    name: 'BasicStepperForm',
    components: {
        FormWizard, TabContent
    },
    data(){
        return {
            fullName: '',
            companyName: '',
            referral: '',
        }
    },
}
</script>
```

#### *Form Stepper Demo*

<iframe
     src="https://codesandbox.io/embed/interesting-elion-ohnet?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="interesting-elion-ohnet"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-autoplay"></iframe>

## Validation Support

### Multi Step Form with Validation

Vue Step Wizard uses [Vuelidate](https://vuelidate.js.org/) plugin under the hood to perform form validations. 
Building a multistep form with validation is a breeze you just need to make sure the data propety matches a couple of syntax and along with that you need to include a mixin named ValidationHelper.

Here is what needs to be done.

#### Include Mixin

To get the validation support, you should include the mixin name ValidationHelper in your component. (If you are doing local component registration this File needs to be imported seperately along with FormWizard and TabContent)

```javascript
    mixins: [ValidationHelper],

    //Local Registration
    import ValidationHelper from '../components/ValidationHelper.vue';
    ....
    mixins: [ValidationHelper]
```

#### Form Data 
* All the form fields (from all the steps), needs to be defined inside a dedicated object named formData

```javascript
    formData:{
        fullName: '',
        email: null,
        companyName: null,
        numberOfEmployees: null,
        referral: null,
        terms: false,
    },
```


#### Validation Rules

For defining the validation rules, you should import the vuelidate validation rule which you are looking to use.

All the validation rules must go under a array named validationRules. Validation of each step must go inside it's own object.

```javascript
    import { required } from 'vuelidate/lib/validators';
    import { email } from 'vuelidate/lib/validators';
    import { numeric } from 'vuelidate/lib/validators';
    ...
    ...
    ...
    validationRules:[
        {fullName: {required}, email: {required, email} },  //Validation Rules for step 1
        {companyName: {required}, numberOfEmployees: {required, numeric} },   //Validation for step 2
        {referral: {required}, terms: {required, numeric} }   //Validation for step 3
    ]
```

For the available built in validators , refer [Vuelidate Builtin Validators](https://vuelidate.js.org/#sub-builtin-validators)

#### Check and Display Error


You can utilize a special method named hasError('fieldName') to check if the field has an error associated with it. 

You can use this to apply error classes on the input field, and also to display the error message. 

```HTML
    <!--Single Error Message-->
    <div class="form-group">
        <label for="fullName">Full Name</label>
        <input type="text" class="form-control" :class="hasError('fullName') ? 'is-invalid' : ''" placeholder="Enter your name" v-model="formData.fullName">
        <div v-if="hasError('fullName')" class="invalid-feedback">
            <div class="error" v-if="!$v.formData.fullName.required">Please provide a valid name.</div>
        </div>
    </div>

    <!--Multiple Error Message-->
    <div class="form-group">
        <label for="email">Your Email</label>
        <input type="email" class="form-control" :class="hasError('email') ? 'is-invalid' : ''" placeholder="Enter your email" v-model="formData.email">
        <div v-if="hasError('email')" class="invalid-feedback">
            <div class="error" v-if="!$v.formData.email.required">Email field is required</div>
            <div class="error" v-if="!$v.formData.email.email">Should be in email format</div>
        </div>
    </div>
```

#### *Multi-Step Form with Validation Demo*

<iframe
     src="https://codesandbox.io/embed/vue-step-wizard-form-with-validation-ghz85?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="vue-step-wizard (Form with Validation)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-autoplay"
   ></iframe>


## Events

### Form Submit

You can utilize the `onComplete` event on form-wizard component to execute the custom code on form submission.


```HTML
    <form-wizard @onComplete="submit">
```


### Next and Previous Step

```HTML
    <form-wizard @onNextStep="nextStep" @onPreviousStep="previousStep">
```