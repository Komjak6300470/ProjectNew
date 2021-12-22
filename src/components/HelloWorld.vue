<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3 green123">
          My Portfolio
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <template>
          <v-card>
            <v-card-title>
              Asset
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="bmiData"
              
              :search="search"
            >
              <template slot="progress">
                <v-progress-linear
                  color="red"
                  indeterminate
                ></v-progress-linear>
              </template>

              <template v-slot:[`item.bmi`]="{ item }">
                <v-chip v-if="item.bmi != 0" :color="getColor(item.bmi)" dark>
                  {{ item.bmi }}
                </v-chip>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-icon large color="yellow darken-2" @click="editItem(item)"
                  >mdi-pencil-outline
                </v-icon>

                <v-icon large color="red darken-2" @click="deleteItem(item)"
                  >mdi-close-circle
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </template>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card class="card-shadow card-padding">
            <v-card-title
              >Are you sure do you want to delete your Asset? ({{ itemSelected.bmi }})</v-card-title
            >
            <v-card-actions class="pb-0">
              <v-spacer></v-spacer>
              <v-btn @click="closeDelete" color="yellow">Cancel</v-btn>

              <v-btn @click="deleteItemConfirm(itemSelected)" color="error"
                >Ok</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
            <br />
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <template>
          <v-btn
            @click="
              editedIndex = '-1';
              dialog = true;
            "
            color="success"
            >Add Asset</v-btn
          >
        </template>

        <v-dialog v-model="dialog" max-width="800px">
          <v-card class="card-shadow">
            <v-card-title>{{ formTitle }}</v-card-title>

            <v-card-text class="card-padding">
              <v-container class="px-0">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <br />

                  <v-row>
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.bmi"
                        
                        :rules="bmiRules"
                        label="Value in Baht"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-dialog
                        ref="dialog"
                        v-model="modal"
                        :return-value.sync="editedItem.date"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.date"
                            label="Date"
                            prepend-icon="mdi-calendar"
                            readonly
                            :rules="dateRules"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.date" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="modal = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog.save(editedItem.date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.note"
                        :rules="noteRules"
                        label="Asset Name"
                      ></v-text-field>
                    </v-col>
                      <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.USD"
                        :rules="bmiRules"
                        label="Price in USD"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.noteea"
                        
                        label="Extra note"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <br />
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions class="card-padding d-flex justify-center">
              <v-btn @click="close" color="error">CANCEL</v-btn>

              <v-btn
                v-if="editedIndex == -1"
                :disabled="!valid"
                @click="validate"
                color="success"
                >Add Asset</v-btn
              >
              <v-btn v-else @click="validate" color="success"
                >EDIT</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getFirestore,
  collection,
  query,
  // where,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  // Timestamp,
} from "firebase/firestore";

import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default {
  data: () => ({
    bmiTable: [
      {
        date: "2021-10-01",
        bmi: 1000000,
        note: "BTC",
        USD: 30303,
        noteea: "Buy for son",
      },
      {
        date: "2021-10-05",
        bmi: 200000,
        note: "ETH",
        USD: 6060,
        noteea: "Buy for son",
      },
      {
        date: "2021-10-06",
        bmi: 50000,
        note: "DOGE",
        USD: 1515,
        noteea: "Elon",
      },
      {
        date: "2021-10-08",
        bmi: 25000,
        note: "GALA",
        USD: 757,
        noteea: "Buy for future",
      },
      {
        date: "2021-10-10",
        bmi: 25000,
        note: "SHIB",
        USD: 757,
        noteea: "Elon tweet",
      },
      {
        date: "2021-10-11",
        bmi: 10000,
        note: "ALPHA",
        USD: 303,
        noteea: "Pools",
      },
      {
        date: "2021-10-12",
        bmi: 50000,
        note: "SOL",
        USD: 1515,
        noteea: "Staking",
      },
      {
        date: "2021-10-14",
        bmi: 50000,
        note: "LUNA",
        USD: 1515,
        noteea: "",
      },
      {
        date: "2021-10-15",
        bmi: 50000,
        note: "ADA",
        USD: 1515,
        noteea: "Buy for profit",
      },
    ],

    search: "",
    headers: [
      {
        text: "Date",
        value: "date",
      },
      {
        text: "Asset",
        value: "note",
      },
      {
        text: "Value in baht",
        value: "bmi",
      },
      {
        text: "Value in USD",
        value: "USD",
      },
       {
        text: "Extra note",
        value: "noteea",
      },
      { text: "Actions", align: "center", value: "actions", sortable: false },
    ],

    valid: true,
    bmi: 0,
    bmiRules: [
      (v) => !!v || "Value can't be null",
      (v) => (v && v > 0 && v < 1000000000000) || "",
    ],
    date: "",
    dateRules: [(v) => !!v || "Date is required"],
    note: "",
    noteRules: [A => A.length > 0   || "Asset name is required"],


    dialog: false,
    dialogDelete: false,
    menu: false,
    modal: false,
    editedIndex: -1,
    itemSelected: {},
    db : getFirestore(),

    editedItem: {
      bmi: "",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      note: "",
    },

    defaultItem: {
      bmi: "",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      note: "",
    },
  }),

  methods:
  
  {
    SignInAnonymously() {
      const auth = getAuth();
      signInAnonymously(auth)
        .then(() => {
          // Signed in..
        })
        .catch((error) => {
          console.log(error);
          // ...
        });
    },
    authStateChanged() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          console.log(user);
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
    },
    getColor(bmi) {
      if (bmi < 18.5) return "black";
      else if (bmi >= 18.5 && bmi < 23) return "black";
      else return "black";
    },

    validate() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          this.createItem();
        } else {
          this.updateItem();
        }
        console.log(this.bmiData);
        this.close();
      } else {
        alert("Form not valid");
      }
    },

    readItem() {
      if (localStorage.getItem("bmi") != null) {
        this.bmiData = JSON.parse(localStorage.getItem("bmi"));
      }

      console.log(this.bmiData);
    },

    async getItemFromFirestore() {
      console.log("get and sync");

      const q = query(collection(this.db, "bmiData"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        this.bmiData = [];
        var tmp = {};
        querySnapshot.forEach((doc) => {
          tmp = Object.assign({ uid: doc.id }, doc.data());
          //(tmp.date = new Date(tmp.date.toDate()).toISOString().substr(0, 10)),
            this.bmiData.push(tmp);
            console.log(tmp);
        });
      });
      console.log(this.bmiData);
      console.log(unsubscribe);
    },

     async createItem() {
      this.editedItem.bmi = parseInt(this.editedItem.bmi);
      // this.bmiData.push(this.editedItem);

      // this.editedItem.date = Timestamp.fromDate(new Date(this.editedItem.date));

      // await setDoc(doc(this.db, "bmiData", "id"), this.editedItem);
      // console.log("insert");

      const docRef = await addDoc(
        collection(this.db, "bmiData"),
        this.editedItem
      );
      console.log("Document written with ID: ", docRef.id);

      // localStorage.setItem("bmi", JSON.stringify(this.bmiData));

      // localStorage.bmi = this.editedItem;
    },

    editItem(item) {
      // this.editedIndex = this.bmiData.indexOf(item);
      this.editedIndex = item.uid;

      // item.date = new Date(item.date.toDate()).toISOString().substr(0, 10);

      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async updateItem() {
      // console.log(this.editedItem);
      this.editedItem.bmi = parseInt(this.editedItem.bmi);
      // this.editedItem.date = Timestamp.fromDate(new Date(this.editedItem.date));
      await setDoc(
        doc(this.db, "bmiData", this.editedIndex),
        this.editedItem
      );
      // console.log("Update");
      // Object.assign(this.bmiData[this.editedIndex], this.editedItem);
      // localStorage.setItem("bmi", JSON.stringify(this.bmiData));
    },

    deleteItem(item) {
      this.itemSelected = item;
      // this.editedIndex = this.bmiData.indexOf(item);

      this.editedIndex = item.uid;
      console.log(this.editedIndex);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      // this.bmiData.splice(this.editedIndex, 1);
      // localStorage.setItem("bmi", JSON.stringify(this.bmiData));

      await deleteDoc(doc(this.db, "bmiData", this.editedIndex));

      console.log("Delete");
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.clearItem();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.clearItem();
    },

    clearItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.itemSelected = {};
      console.log(this.editedIndex);
    },
  },
  watch: {
    editedIndex(val) {
      console.log(val);
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Asset" : "Add Asset";
    },
  },
  mounted() {
    // this.readItem();
    this.SignInAnonymously();
    this.authStateChanged();
    this.getItemFromFirestore();
  },

};
</script>

<style>
.green123 {
  color: rgb(255, 255, 255);
}
</style>
<style>
.color {
  color: rgb(160, 58, 40);
}
</style>