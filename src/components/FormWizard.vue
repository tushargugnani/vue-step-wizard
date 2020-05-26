<template>
    <div class="card">
        <div class="card-header">
        <ul class="nav nav-pills nav-wizard nav-fill">
            <li @click="selectTab(index)" class="nav-item" :class="tab.isActive ? 'active' : 'in-active'" v-for="(tab, index) in tabs" v-bind:key="`tab-${index}`">
                <a class="nav-link"  href="#">
                        <span class="tabStatus">{{index+1}} </span> 
                        <span class="tabLabel">{{tab.title}}</span>
                </a>
            </li>
        </ul>
        </div>
        <div class="card-body">
        <div class="col-lg-8 mx-auto">
   
            <form>
            <slot></slot>
            </form>

        </div>
        </div>
        <div class="card-footer text-center">
            <div class="btn-group" role="group">
                <button @click="previousTab" :disabled="currentTab === 0" class="btn btn-warning">Previous</button>
                <button @click="nextTab" v-if="currentTab < totalTabs - 1" class="btn btn-primary">Next</button>
                <button @click="onSubmit" v-if="currentTab === totalTabs - 1" class="btn btn-success">Submit</button>
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
        }
    },
    mounted(){
            this.tabs = this.$children;
            this.totalTabs = this.tabs.length;
            this.currentTab = this.tabs.findIndex((tab) => tab.isActive === true);
    },
    methods:{
        previousTab(){
            this._switchTab(this.currentTab - 1);
        },

        nextTab(){

            if(this._validateCurrentTab() === false)
                return;

            this._switchTab(this.currentTab + 1);              
              
        },

        selectTab(index){
            if(index < this.currentTab){
              this._switchTab(index);
            }

            if(this._validateCurrentTab() === false){
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
        },

        _validateCurrentTab(){
            if(Object.keys(this.storeState.v).length === 0 && this.storeState.v.constructor === Object)
                return true;

            this.storeState.v.$touch();

            if (this.storeState.v.$invalid) {
                return false;
            }

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
  /** Wizard */
  .nav-pills.nav-wizard > li {
    position: relative;
    overflow: visible;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
  }
  .nav-pills.nav-wizard > li + li {
    margin-left: 0;
  }
  .nav-pills.nav-wizard > li:first-child {
    border-left: 0;
  }
  .nav-pills.nav-wizard > li:first-child a {
    border-radius: 5px 0 0 5px;
  }
  .nav-pills.nav-wizard > li:last-child {
    border-right: 0;
  }
  .nav-pills.nav-wizard > li:last-child a {
    border-radius: 0 5px 5px 0;
  }
  .nav-pills.nav-wizard > li a {
    border-radius: 0;
    background-color: #eee;
  }
  .nav-pills.nav-wizard > li:not(:last-child) a:after {
    position: absolute;
    content: "";
    top: 0px;
    right: -20px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 20px 0 20px 20px;
    border-color: transparent transparent transparent #eee;
    z-index: 150;
  }
  .nav-pills.nav-wizard > li:not(:first-child) a:before {
    position: absolute;
    content: "";
    top: 0px;
    left: -20px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 20px 0 20px 20px;
    border-color: #eee #eee #eee transparent;
    z-index: 150;
  }
  .nav-pills.nav-wizard > li:hover:not(:last-child) a:after {
    border-color: transparent transparent transparent #aaa;
  }
  .nav-pills.nav-wizard > li:hover:not(:first-child) a:before {
    border-color: #aaa #aaa #aaa transparent;
  }
  .nav-pills.nav-wizard > li:hover a {
    background-color: #aaa;
    color: #fff;
  }
  .nav-pills.nav-wizard > li.active:not(:last-child) a:after {
    border-color: transparent transparent transparent #428bca;
  }
  .nav-pills.nav-wizard > li.active:not(:first-child) a:before {
    border-color: #428bca #428bca #428bca transparent;
  }
  .nav-pills.nav-wizard > li.active a {
    background-color: #428bca;
    color: #fff;
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

  .nav-pills .nav-item{
      margin: 0px 10px;
  }

</style>