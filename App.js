import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage} from 'react-native';
import { AppLoading } from 'expo';
import Todo from './Todo'
import uuidv1 from 'uuid/v1'

const { width, height } = Dimensions.get("window");

export default class App extends Component {
  state = {
    newTodo: '',
    isTodoLoaded: false,
    todos: {}
  }
  _controllNewTodo = text => {
    this.setState({
      newTodo: text,
    })
  }
  _loadTodo = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      const parsedTodos = JSON.parse(todos);
      this.setState({ isTodoLoaded: true, todos: parsedTodos || {} });

    } catch(err) {
      console.log(err)
    }
    this.setState({
      isTodoLoaded: true
    })
  }
  _addTodo = () => {
    const { newTodo } = this.state;
    if(newTodo !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const  newTodoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newTodo: '',
          todos: {
            ...prevState.todos,
            ...newTodoObject
          }
        }
        this._saveTodo(newState.todos);
        return { ...newState };
      })
    }
  }
  _deleteTodo = (id) => {
    this.setState(prevState => {
      const allTodo = prevState.todos;
      delete allTodo[id];
      const newState = {
        ...prevState,
        ...allTodo
      }
      this._saveTodo(newState.todos);
      return {...newState};
    })
  }

  _uncompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      }
      this._saveTodo(newState.todos);
      return {...newState};
    })
  }
  _completeTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      }
      this._saveTodo(newState.todos);
      return {...newState};
    })
  }
  _updateTodo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            text: text
          }
        }
      }
      this._saveTodo(newState.todos);
      return {...newState};
    })
  }
  _saveTodo = (newTodos) => {
    const saveTodos = AsyncStorage.setItem('todos', JSON.stringify(newTodos));
  }

  componentDidMount = () => {
    this._loadTodo();
  }

  render() {
    const { newTodo, isTodoLoaded, todos } = this.state;
    if(!isTodoLoaded) {
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>Todo with React Native</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"Input what to do"}
            value={newTodo}
            onChangeText={this._controllNewTodo}
            placeholderTextColor={"#999"}
            autoCorrect={false}
            onSubmitEditing={this._addTodo}
            underlineColorAndroid={"transparent"}
          />
          <ScrollView contentContainerStyle={styles.list}>
            {Object.values(todos).reverse().map(todo =>
              <Todo
                key={todo.id}
                {...todo}
                deleteTodo={this._deleteTodo}
                uncompleteTodo={this._uncompleteTodo}
                completeTodo={this._completeTodo}
                updateTodo={this._updateTodo}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0080FF',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 50,
    fontWeight: '300',
    marginBottom: 35
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 23
  },
  list: {
    alignItems: 'center'
  }
});
