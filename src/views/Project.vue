<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3 white123">
          Portfolio
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
              :items="bmiTable"
              :loading="!bmiTable.length"
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
              >Delete? ({{ itemSelected.bmi }})</v-card-title
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
                      <v-text-field
                        v-model="editedItem.note"
                        
                        label="Asset Name"
                      ></v-text-field>
                    </v-col>
                      <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.usd"
                        :rules="usdRules"
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
              <v-btn @click="close" color="error">Cancel</v-btn>

              <v-btn
                v-if="editedIndex == -1"
                :disabled="!valid"
                @click="validate"
                color="success"
                >Add Asset</v-btn
              >
              <v-btn v-else @click="validate" color="success"
                >Edit</v-btn
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
  where,
  onSnapshot,
  addDoc, 
  doc, deleteDoc, setDoc,
} from "firebase/firestore";



import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default {
  data: () => ({
    bmiTable: [
      {
        
        bmi: 1000000,
        note: "BTC",
        usd: 30303,
        noteea: "Buy for son",
      },
      {
        
        bmi: 200000,
        note: "ETH",
        usd: 6060,
        noteea: "Buy for son",
      },
      {
        
        bmi: 50000,
        note: "DOGE",
        usd: 1515,
        noteea: "Elon",
      },
      {
        
        bmi: 25000,
        note: "GALA",
        usd: 757,
        noteea: "Buy for future",
      },
      {
    
        bmi: 25000,
        note: "SHIB",
        usd: 757,
        noteea: "Elon tweet",
      },
      {
      
        bmi: 10000,
        note: "ALPHA",
        usd: 303,
        noteea: "Pools",
      },
      {
       
        bmi: 50000,
        note: "SOL",
        usd: 1515,
        noteea: "Staking",
      },
      {
        
        bmi: 50000,
        note: "LUNA",
        usd: 1515,
        noteea: "",
      },
      {
        
        bmi: 50000,
        note: "ADA",
        usd: 1515,
        noteea: "Buy for profit",
      },
    ],

    search: "",
    headers: [
     
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
        value: "usd",
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
    
    usdRules: [
      (v) => !!v || "Value can't be null",
      (v) => (v && v > 0 && v < 1000000000000) || "",
    ],

    
    note: "",

    dialog: false,
    dialogDelete: false,
    menu: false,
    modal: false,
    editedIndex: -1,
    itemSelected: {},
    db : getFirestore(),


    editedItem: {
      bmi: "",
     
      note: "",
    },

    defaultItem: {
      bmi: "",
     
      note: "",
    },




  }),

  methods: {
    getColor(bmi) {
      if (bmi < 18.5) return "black";
      else if (bmi >= 18.5 && bmi < 23) return "black";
      else return "black";
    },
    SignInAnonymously() { const auth = getAuth(); 
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


    validate() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          this.createItem();
        } else {
          this.updateItem();
        }
      
        console.log(this.bmiTable);
        this.close();
      } else {
        alert("Form not valid");
      }
    },

    readItem() {
      if (localStorage.getItem("bmi") != null) {
        this.bmiTable = JSON.parse(localStorage.getItem("bmi"));
      }

      console.log(this.bmiTable);
    },

   async getItemFromFirestore() {
      console.log("get and sync");



      const q = query(collection(this.db, "bmiTable"), where("bmi", ">", 0));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        this.bmiTable = [];
        var tmp = {};
        querySnapshot.forEach((doc) => {
          tmp = Object.assign({ uid: doc.id }, doc.data());
          
            this.bmiTable.push(tmp);
        });
      });
      console.log(this.bmiTable);
      console.log(unsubscribe);
    },
async createItem() {
          this.editedItem.bmi = parseInt(this.editedItem.bmi);         

          

          const docRef = await addDoc(collection(this.db, "bmiTable"), this.editedItem);
          console.log("Document written with ID: ", docRef.id);
        },
editItem(item) {
        this.editedIndex = item.uid;
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
async updateItem() {
        this.editedItem.bmi = parseInt(this.editedItem.bmi);
        
        await setDoc(doc(this.db, "bmiTable", this.editedIndex), this.editedItem);
},
deleteItem(item) {
        this.itemSelected = item;
        this.editedIndex = item.uid;
        console.log(this.editedIndex);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },
async deleteItemConfirm() {    
        await deleteDoc(doc(this.db, "bmiTable", this.editedIndex));
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
      return this.editedIndex === -1 ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
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
  color: green;
}
</style>
