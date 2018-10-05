import React, { Component } from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import PropTypes from 'prop-types';
const { width, height } = Dimensions.get("window");

export default class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, todoValue: props.text }
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    uncompleteTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  };

  _toggleComplete = (event) => {
    event.stopPropagation();
    const { isCompleted, completeTodo, uncompleteTodo, id } = this.props;
    if(isCompleted) {
      uncompleteTodo(id);
    } else {
      completeTodo(id);
    }
  }
  _startEditing = (event) => {
    this.setState({ isEditing: true })
  }
  _finishEditing = (event) => {
    const { todoValue } = this.state;
    const { id, updateTodo } = this.props;
    updateTodo(id, todoValue);
    this.setState({ isEditing: false })
  }
  _controlInput = (text) => {
    this.setState({ todoValue : text })
  }

  render() {
    const { isEditing, todoValue } = this.state;
    const { text, id, deleteTodo, isCompleted } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View style={[styles.circle,
              isCompleted ? styles.completedCircle : styles.uncompletedCircle]}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
             style={[styles.text, styles.input, isCompleted ? styles.completedText : styles.uncompletedText]}
             value={todoValue}
             multiline={true}
             onChangeText={this._controlInput}
             returnKeyType={"done"}
             //onBlur: 입력 칸 바깥을 터치하면 편집종료함수 실행
             onBlur={this._finishEditing}
             underlineColorAndroid={"transparent"}
            />
           ) : (
            <Text style={[styles.text,
              isCompleted ? styles.completedText : styles.uncompletedText]}
            >
              {text}
            </Text>
          )}
        </View>
        {isEditing ? (
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._finishEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>✅</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._startEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>✏️</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPressOut={(event) => {
                event.stopPropagation;
                deleteTodo(id);
              }}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>❌</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20
  },
  completedCircle: {
    borderColor: '#bbb'
  },
  uncompletedCircle: {
    borderColor: '#FF0000'
  },
  text: {
    fontWeight: "500",
    fontSize: 22,
    marginVertical: 20
  },
  completedText: {
    color: '#bbb',
    textDecorationLine: 'line-through'
  },
  uncompletedText: {
    color: 'black'
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2
  },
  actions: {
    flexDirection: 'row'
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 15,
    width: width / 2,
    paddingBottom: 5
  }
})
