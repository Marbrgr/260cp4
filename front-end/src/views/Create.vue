<template>
<div class="admin">
  <div class="prompt">
    <h1>Save memories to your journal!</h1>
  </div>
      
    <div class="heading">
      <h2>Create an entry!</h2>
    </div>
    
    <div class="add">
      <div class="form">
        <input v-model="username" placeholder="Username">
        <p></p>
        <input v-model="date" placeholder="Date">
        <p></p>
        <input v-model="subject" placeholder="Subject">
        <p></p>
        <textarea v-model="content" placeholder="Entry"/>
        <p></p>
        <button @click="saveEntry">Save</button>
        <p></p>
        
      </div>
    </div>

     <div class="heading">
      <h2>Edit/Delete an entry</h2>
    </div>
    <div class="edit">
      <div class="form">
        <input v-model="findUser" placeholder="Search Users">
        <div class="suggestions" v-if="users.length > 0"> 
          <div class="suggestion" v-for="u in users" :key="u.id" @click="selectUser(u)">{{u}}
          </div>
        </div>
        <p></p>

        <input v-model="findEntryTitle" placeholder="Select Subject">
        <div class="suggestions" v-if="userEntries.length > 0">
          <div class="suggestion" v-for="x in userEntries" :key="x.id" @click="selectEntry(x)">{{x.subject}}
          </div>
        </div>
        
      </div>


      <div class="upload" v-if="findEntry">
        <input v-model="findEntry.username" placeholder="Username">
        <p></p>
        <input v-model="findEntry.date" placeholder="Date">
        <p></p>
        <input v-model="findEntry.subject" placeholder="Subject">
        <p></p>
        <textarea v-model="findEntry.content" placeholder="Entry"/>
        <p></p>
       
      </div>

      <div class="actions" v-if="findEntry">
        <button @click="deleteEntry(findEntry)">Delete</button>
        <button @click="editEntry(findEntry)">Edit</button>
      </div>
    </div>

    
    
</div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'Admin',
  data() {
    return {
      
      title: "",
      subject: "",
      username: "",
      description: "",
      content: "",
      date: "",
      file: null,
      addItem: null,
      items: [],
      entries: [],
      findTitle: "", //was ""
      findItem: null,
      findUser: "",
      findEntryTitle: "",
      findEntry: null,
      userEntries: [],
      usernames: [],
    }
  },
  computed: {
    suggestions() {
      let items = this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return items.sort((a,b) => a.title > b.title);
    },
    users() {
      let userArray = [];
      for (var i = 0; i < this.entries.length; i++) {
        if (! userArray.includes(this.entries[i].username)) {
          userArray.push(this.entries[i].username);
        }
      }
      return userArray.sort((a,b) => a > b);
    }
  },
  created() {
    this.getItems();
    this.getEntries();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async saveEntry() {
      try {
        await axios.post('/api/saveEntry', {
          username: this.username,
          content: this.content,
          date: this.date,
          subject: this.subject,
        })
      } catch (error) {
        return false;
       
      }
      this.getEntries();
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)//;?
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/items', {
          title: this.title,
          //new
          description: this.description,
          //
          path: r1.data.path,
        });
        this.addItem = r2.data.path
        //new
        //new
      
      } catch (error) {
        return false;
      }
      //new
      this.title = "";
      this.description = "";
      //new
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        return false;
      }
    },
    async getEntries() {
      try {
        let response = await axios.get("/api/entries");
        this.entries = response.data;
      } catch (error) {
        return false;
      }
        let userArray = [];
        for (var i = 0; i < this.entries.length; i++) {
        if (! userArray.includes(this.entries[i].username)) {
          userArray.push(this.entries[i].username);
        
        }
        this.usernames = userArray.sort((a,b) => a > b);
      return true;
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    selectUser(user) {
      this.findUser = user;
      this.userEntries = this.entries.filter(entry => entry.username.toLowerCase() === user.toLowerCase());
    },
    selectEntry(entry) {
      this.findEntry = entry;
      this.findUser = "";
    },
    async deleteItem(item) {
      try {
        await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        return false;
      }
    },
    async deleteEntry(entry) {
      try {
        await axios.delete("/api/entries/" + entry._id);
        this.findEntry = null;
        this.getEntries();
        let testVar = this.users();
      } catch (error) {
        return false;
      }
      return true;
    },
    async editEntry(entry) {
      try {
        await axios.put("/api/entries/" + entry._id, {
          username: this.findEntry.username,
          content: this.findEntry.content,
          date: this.findEntry.date,
          subject: this.findEntry.subject,
        })
        this.findEntry = null;
        this.getEntries();
       
        return true;
      } catch (error) {
        return false;
      }

    },
    async editItem(item) {
      try {
        await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          description: this.findItem.description,
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        return false;
      }
    },
  }
}
</script>


<style scoped>

.admin {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
}

.image h2 {
  font-style: italic;
  font-size: 1em;
}

.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
  
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}

.prompt {
  width: 100%;
}

</style>

