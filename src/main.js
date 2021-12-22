import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

Vue.config.productionTip = false
const firebaseConfig = {
  apiKey: "AIzaSyCTbyZkzTLZULl_svr3E3sEvWNrSqX-0UY",
  authDomain: "itefinal-a122d.firebaseapp.com",
  projectId: "itefinal-a122d",
  storageBucket: "itefinal-a122d.appspot.com",
  messagingSenderId: "537277450068",
  appId: "1:537277450068:web:fa253aaef063e56a9baac1",
  measurementId: "G-401KYGKCR8"
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

new Vue({
  router,
  vuetify,
  firebase,
  render: h => h(App)
}).$mount('#app')

