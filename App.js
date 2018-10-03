import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import Todo from './Todo'

const { width, height } = Dimensions.get("window");

export default class App extends Component {
  state = {
    newTodo: ''
  }
  _addTodo = text => {
    this.setState({
      newTodo: text
    })
  }

  render() {
    const { newTodo } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>Todo with React Native</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"Input what to do"}
            value={newTodo}
            onChangeText={this._addTodo}
            placeholderTextColor={"#999"}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.list}>
            <Todo />
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
