<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="user.photoURL"
      height="200px"
    ></v-img>

    <v-card-title>
      <div>{{ user.displayName }} ({{ user.email }})</div>
    </v-card-title>

    <v-card-subtitle>
      Portfolio
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
          v-if="!singInState"
          depressed
          color="orange lighten-2"
          @click="goto('/')"
        >
          click Bitcoin to go to Portfolio
        </v-btn>

      <v-spacer></v-spacer>

      
    </v-card-actions>
  </v-card>
</template>
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data: () => ({
    user: {},
  }),
  methods: {
    authStateChanged() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          console.log(user);
          this.user = user;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
    },
  },
  watch: {},
  computed: {},
  mounted() {
    this.authStateChanged();
  },
};
</script>
<style></style>
