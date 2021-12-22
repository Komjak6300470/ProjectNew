<template>
  <v-app>
    <v-app-bar app color="blue-grey">
       <v-toolbar-title>Portfolio</v-toolbar-title>
     
     <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2 pointer"
          contain
          src="https://cdn-icons-png.flaticon.com/512/1490/1490849.png"
          transition="scale-transition"
          width="40"
          @click="goto('/')"
        />
          
        >
        &nbsp;&nbsp;
        <v-btn
          v-if="!singInState"
          depressed
          color="success"
          @click="goto('/signinform')"
        >
          Login
        </v-btn>
        <v-btn
          v-if="singInState"
          depressed
          color="success"
          @click="goto('/profile')"
        >
          Profile
        </v-btn>
        <v-btn v-if="singInState" depressed color="red" @click="SignOut">
          Sign Out
        </v-btn>
      </div>
        
      
      <v-spacer></v-spacer>

      
        
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>

</template>

<style>
#app {
  background: url('https://wallpaperaccess.com/full/1393720.jpg')
    no-repeat center center fixed !important;
  background-size: cover;
}
</style>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
export default {
  name: "App",

  data: () => ({
    drawer: null,
    items: [
      { title: "Home", icon: "mdi-view-dashboard", link: "/" },
      { title: "About", icon: "mdi-forum", link: "/about" },
    ],
    singInState: false,
  }),

  methods: {
    goto(path) {
      this.$router.push(path);
    },
    menuItems() {
      return this.menu;
    },
    SignOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          this.$router.push({ path: "/signinform" });
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    },
    authStateChanged() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          console.log(user);
          this.singInState = true;
          // ...
        } else {
          // User is signed out
          // ...
          this.singInState = false;
        }
      });
    },
  },
  mounted() {
    this.authStateChanged();
  },
};
</script>

<style>
.pointer {
  cursor: pointer;
}
</style>
Firebase
