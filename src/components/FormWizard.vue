<template>
    <div class="vue-step-wizard">
        <div class="step-header">
        <div class="step-progress">
            <div class="bar progressbar" :style="{ width: progress + '%' }">
            </div>
        </div>
        <ul class="step-pills">
            <li @click.prevent.stop="selectTab(index)" class="step-item" :class="{ 'active': tab.isActive, 'validated': tab.isValidated }" v-for="(tab, index) in tabs" v-bind:key="`tab-${index}`">
                <a class="step-link" href="#">
                        <span class="tabStatus">{{index+1}} </span> 
                        <span class="tabLabel">{{tab.title}}</span>
                </a>
            </li>
        </ul>
        </div>
        <div class="step-body">
            <form>
                <slot></slot>
            </form>
        </div>
        <div class="step-footer">
            <div class="btn-group" role="group">
                <template v-if="!submitSuccess">
                  <button @click="previousTab" :disabled="currentTab === 0" class="step-button step-button-previous">Previous</button>
                  <button @click="nextTab" v-if="currentTab < totalTabs - 1" class="step-button step-button-next">Next</button>
                  <button @click="onSubmit" v-if="currentTab === totalTabs - 1" class="step-button step-button-submit">Submit</button>
                </template>
                <template v-else>
                  <button @click="reset" class="step-button step-button-reset">Reset</button>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { store } from "./store.js";
export default {
    name: 'form-wizard',
    data(){
        return{
            tabs: [],
            currentTab : 0,
            totalTabs : 0,
            storeState: store.state,
            submitSuccess : false,
            progress: 0,
            isValidationSupport: false
        }
    },
    mounted(){
            this.tabs = this.$children;
            this.totalTabs = this.tabs.length;
            this.currentTab = this.tabs.findIndex((tab) => tab.isActive === true);

            //Select first tab if none is marked selected
            if(this.currentTab === -1 && this.totalTabs > 0){  
                this.tabs[0].isActive = true;
                this.currentTab = 0;
            }
            
            //Setup Initial Progress
            this.progress = ((this.currentTab + 1) / this.totalTabs * 100);

    },

    updated(){
        /*
          Using this lifehook - since store variable gets updated after component is mounted
          isValidationSupport checks if user is looking to perform validation on each step
        */
        this.isValidationSupport = (Object.keys(this.storeState.v).length !== 0 && this.storeState.v.constructor === Object) ? true : false;
    },

    methods:{
        previousTab(){
            this._switchTab(this.currentTab - 1);

            this.$emit('onPreviousStep'); 
        },

        nextTab(){

            if(this._validateCurrentTab() === false)
                return;

            this._switchTab(this.currentTab + 1);    

            this.$emit('onNextStep');          
              
        },

        reset(){

           this.tabs.forEach(tab => {
             tab.isActive = false;
             tab.isValidated = false;
           });

           this._switchTab(0);
           this.submitSuccess = false;
           this.storeState.v.$reset();

           this.$emit('onReset');
        },

        changeStatus(){
            this.submitSuccess = true;
        },

        selectTab(index){
            if(index < this.currentTab){
              this._switchTab(index);
            }

            if(this._validateCurrentTab() === false){
                return;
            }

            if(this.tabs[index - 1].isValidated === false){
                return;
            }

            this._switchTab(index);
            
        },


        onSubmit(){
            if(this._validateCurrentTab() === false)
                return;
            this.$emit('onComplete');
        },

        _switchTab(index){
            //Disable all tabs
            this.tabs.forEach(tab => {
              tab.isActive = false;
            });

            this.currentTab = index;
            this.tabs[index].isActive = true;

            this.progress = ((this.currentTab + 1) / this.totalTabs * 100);
        },

        _validateCurrentTab(){
            if(!this.isValidationSupport)  //Check if user wants to validate 
                return true;

            this.storeState.v.$touch();

            if (this.storeState.v.$invalid) {
                this.tabs[this.currentTab].isValidated = false;
                return false;
            }

            this.tabs[this.currentTab].isValidated = true;

            return true;
        }
    },
    watch:{
       currentTab(){
          store.setCurrentTab(this.currentTab);
       }
    }
    
}
</script>
<style>

  .progressbar {
    transition: width 1s ease;
  } 

  .vue-step-wizard{
    background-color: #F7F8FC;
    width: 900px;
    margin: auto;
    padding: 40px;
  }

  .step-progress{
    height: 1rem;
    background: white;
    border-radius: 1rem;
    margin: 1rem 0rem;
  }

  .step-progress .bar{
      content: '';
      height: 1rem;
      border-radius: 1rem;
      background-color: #4B8AEB;
  }

  .step-pills{
    display: flex;
    background-color: white;
    justify-content: space-between;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
  }

  .step-pills .step-item{
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: 5px 20px;
    list-style-type: none;
    padding: .5rem 1.5rem;
  }


   .step-pills .step-item a{
     text-decoration: none;
     color: #7B7B7B;
   }

   .step-pills .step-item.active{
      border: 1px solid #4B8AEB;
   }

   .step-pills .step-item.validated{
      border: 1px solid #008011;
   }

   .step-body{
     background-color: white;
     margin-left: auto;
     padding: 1rem;
     border-radius: 1rem;
     box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
   }

  .step-footer{
     margin-left: auto;
     padding: 1rem;
     border-radius: 1rem;
     margin: 1rem 0rem;
     text-align: center;
   }

  .step-button{
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    position: relative;
    max-width: 30rem;
    text-align: center;
    border: 1px solid;
    border-radius: 12px;
    color: #22292f;
    color: rgba(34,41,47,var(--text-opacity));
    padding: 0.5rem 1.25rem;
    font-size: .875rem;
    margin: 0.5rem;
    color: #fff;
    outline: none !important;
    box-shadow: none !important;
  }

  .step-button-next{
    background-color: #126fde;
  }

  .step-button-previous{
    background-color: #3deaba;
  }

  .step-button-submit{
    background-color: #4fa203;
  }

  .step-button-reset{
    background-color: #037da2;
  }

  /** Wizard Ends */
  .tabStatus{
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      margin-right: .5rem;
      line-height: 1.5rem;
      color: #fff;
      text-align: center;
      background: rgba(0,0,0,0.38);
      border-radius: 50%;
  }


</style>