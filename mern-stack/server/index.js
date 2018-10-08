const { GraphQLServer } = require('graphql-yoga')
//import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

//Defining a model
var Todo = mongoose.model("Todo", {
    text: String,
    complete: Boolean
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }

  type Todo {
      id: ID
      text: String!
      complete: Boolean!
  }

  type Mutation {
      createTodo(text: String!): Todo
      updateTodo(id: String!, complete: Boolean!): Boolean
      removeTodo(id: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
      createTodo: async (_, {text}) => {
          const todo = new Todo({text, complete:false});
          await todo.save();
          return todo;
      },
      updateTodo: async(_, {id, complete})=> {
         //const todo = new Todo({id: id, complete: complete});
         await Todo.findByIdAndUpdate(id, { $set : {complete: complete } })
         return true;
      },
      removeTodo: async (_,{id})=>{
         await Todo.findByIdAndDelete(id)
         return true
      }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers })

//starting the server only when db is connected
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    server.start(() => console.log('Server is running on localhost:4000'))
});
