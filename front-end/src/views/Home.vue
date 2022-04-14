<template>
<div class="home">

  <div class="create">
    <img class="draw" src="lepen.png"/>
    <router-link to="/Create">Add an entry!</router-link>
    <p> </p>
  </div>



  <h1> Past entries: </h1>
  <p></p>
  <section class="entry-gallery">
    <div class="journal" v-for="entry in entries" :key="entry.id">
      <h1> {{entry.username}}</h1>
      <h2>{{entry.date}}</h2>
      <h2>{{entry.subject}}</h2>
      <p>{{entry.content}}</p>
    </div>
  </section>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      entries: [],
    }
  },
  created() {
    this.getEntries();
  },
  methods: {
    async getEntries() {
      try {
        let response = await axios.get("/api/entries");
        this.entries = response.data;
        return true;
      } catch (error) {
        return false;
      }
      }

  }
}
</script>

<style scoped>

.create {
  width: 100%;
  align-content: right;
  text-align: right;
  display: block;
  color: black;
}



/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.entry-gallery {
  column-gap: 1.5em;
}

.journal {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
  border-color: black;
  border-width: 2px;
  border-style: dashed;
  padding: 10px;
  margin: 5px;
}


.draw {
  width: 5em;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .entry-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .entry-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .entry-gallery {
    column-count: 2;
  }
}

/* Footer */

.footer {
   position: fixed;
   left: 0;
   bottom: 0;
   width: 100%;
   background-color: white;
   text-align: center;
}



</style>
