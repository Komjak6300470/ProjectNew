<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-6">Login</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="[(v) => !!v || 'Password is required']"
            label="Password"
            type="password"
            :counter="20"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="black"
            class="mr-4"
            @click="SignInWithEmailAndPassword"
          >
            Login
          </v-btn>
        </v-form>
      </v-col>
    </v-row >
      <v-row>
        <v-col class="d-flex justify-center align-center">
          <v-btn color="black" class="" @click="gooleSignIn">
            Login with google
          </v-btn>
        </v-col>
      </v-row>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default {
  data: () => ({
    valid: true,
    email: "",
    password: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    snackbar: false,
    text: "Username or Password Incorrect.",
    timeout: 2000,
  }),
  methods: {
    SignInWithEmailAndPassword() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          console.log(userCredential);
          this.$router.push({ path: "/crudfirestore" });
          // ...
        })
        .catch((error) => {
          this.snackbar = true;
          console.log(error);
        });
    },
    gooleSignIn() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          console.log(result);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          console.log(credential);
          this.$router.push({ path: "/Profile" });

          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          console.log(error);
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(credential);
          // ...
        });
    },
  },
  watch: {},
  computed: {},
  mounted() {},
};
</script>
<style></style>
