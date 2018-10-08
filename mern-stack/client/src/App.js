import  React, { Component} from 'react';
import ReactDOM from 'react-dom';
import gql from "graphql-tag";
import {graphql , compose} from 'react-apollo';
const TodoQuery = gql`
{
  todos{
    id
    text
    complete
  }
}
`;

const updateMutation = gql`
  mutation($id: String!){
    removeTodo(id: $id)
  }
`

const createTodo = gql`
  mutation($text: String!){
    createTodo(text:$text){
      id
      text
      complete
    }
  }
`


class App extends Component {

  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);  

  }

  handleSubmit(e) {
    e.preventDefault();

    let addVal = ReactDOM.findDOMNode(this.refs.add);

    this.props.createTodo({
      variables: {
        text: addVal.value
      },  update(params) {
          window.location.reload();
      }
    });

    console.log(addVal.value);
    // reset the form
  }

  removeTodo = async todo => {
    await this.props.removeTodo({
      variables: {
        id: todo.id
      },  update(params) {
          window.location.reload();
      }
    });
  }

  addTodo = async event => {
      console.log(event.target.value)
      
  }

  render() {

    console.log(this.props);

    const { data : { loading, todos } } = this.props;

    if( loading ){
      return null;
    }

    return (
      <div>
        <h3 style={{marginLeft:'38%'}}>Assignment Application</h3>
        <form style={{marginLeft:'40%', marginBottom:'4%'}} onSubmit={this.handleSubmit}>
          <input placeholder="add todo" ref="add" />
          <button>Add Todo</button>
        </form>
        {/* <input   placeholder="enter todo name" onClick={ (event) => this.addTodo(event) }/> */}
        <div style={{marginLeft: '35%', width: '400px'}}>
            { todos.map((todo, index) => (
              <div key={todo.id}>
                    <div style={{width:'40%', float:'left'}}>{todo.text}</div>
                    <div 
                      onClick={() => this.removeTodo(todo)}
                      style={{width:'20%', float:'left', border:'1px solid #eee', 
                      background:'red', textAlign:'center', color:'white'}}>
                      Delete
                    </div>
              </div>
            )) }
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(updateMutation, { name: "removeTodo" } ), 
  graphql(TodoQuery),
  graphql(createTodo, { name: "createTodo" } ), 
) (App);
