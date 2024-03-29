import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./_db.js";
import cors from "cors";

// types
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },

  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
    },
  },

  Mutation: {
    deleteGame(_, args) {
      db.games = db.games.filter((g) => g.id !== args.id);
      return db.games;
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 1000).toString(),
      };
      db.games.push(game);
      return game;
    },
    updateGame(_, args) {
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          return { ...g, ...args.edits };
        }

        return g;
      });

      return db.games.find((g) => g.id === args.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  // Resolvers, how we respond to queries
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

/*
query all games
query GamesQuery {
  games {
    title
    platform
  }
}


Query a single review with id of 1

query ReviewQuery($id: ID!) {
 review(id: $id){
  rating
  content
 }
}


// Variable section of Apollo Server
{
  "id": "1"
}


// Get reviews for a game
query GameQuery($id: ID!) {
 game(id: $id){
  title,
  reviews {
    rating
    content
  }
 }
}

{
  "id": "2"
}


// Get reviews for an author
query AuthorQuery($id: ID!) {
 author(id: $id){
  name,
  reviews {
    rating
    content
  }
 }
}

{
  "id": "1"
}


// Get a game title and platform from a review
query ReviewsQuery($id: ID!){
  review(id: $id){
    rating
    game{
      title
      platform
    },
    author {
      name
      verified
    }
  }
}

{
  "id": "1"
}


// get all reviews associated with a game
query ReviewsQuery($id: ID!){
  review(id: $id){
    rating
    game{
      title
      platform
      reviews{
        rating
      }
    },
  }
}

{
  "id": "1"
}

// Delete a game
mutation DeleteMutation($id: ID!){
  deleteGame(id: $id){
    id
    title
    platform
  }
}

{
  "id": "2"
 }


 // Add a new game
 mutation AddMutation($game: AddGameInput!){
  addGame(game: $game){
    id
    title
    platform
  }
}

{
  "game": {
    "title": "Halo",
    "platform": ["Xbox"]
  }
}

// edit/update game
mutation EditMutation($edits: EditGameInput!, $id: ID!){
  updateGame(edits: $edits, id: $id){
    title
    platform
  }
}

{
  "edits": {
   "title": "Super Metroid",
   "platform": ["Snes"]" 
  },
  "id": "2"
}
*/
