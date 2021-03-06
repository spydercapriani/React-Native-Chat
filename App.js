import React, { Component } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  send,
  subscribe
} from 'react-native-training-chat-server';
import ReversedFlatList from 'react-native-reversed-flat-list';
import Header from './src/Header';

const NAME = 'Anonymous'
const CHANNEL = 'React Native Chat'
const AVATAR = 'https://maxcdn.icons8.com/Share/icon/ios7/Cinema//anonymous_mask1600.png';

export default class App extends Component {
  state = {
    typing: "",
    messages: [],
  };

  componentDidMount() {
    subscribe(CHANNEL, messages => {
      this.setState({messages});
    });
  }

  async sendMessage() {
    await send({
      channel: CHANNEL,
      sender: NAME,
      avatar: AVATAR,
      message: this.state.typing
    });

    this.setState({
      typing: '',
    });
  }

  renderItem({item}) {
    return (
      <View style={styles.row}>
        <Image style={styles.avatar} source={{uri: item.avatar}}/>
        <View style={styles.rowText}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={CHANNEL}/>
        <ReversedFlatList data={this.state.messages} renderItem={this.renderItem} />
        <KeyboardAvoidingView behavior="padding">
        <View style={styles.footer}>
          <TextInput
            value={this.state.typing}
            onChangeText={text => this.setState({typing: text})}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Type something nice"
            onChangeText={text => this.setState({typing: text})}
            keyboardType='default'
            returnKeyType='send'
            onSubmitEditing={
              this.sendMessage.bind(this)
            }
          />
          <TouchableOpacity onPress={this.sendMessage.bind(this)}>
            <Text style={styles.send}>Send</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row'
  },
  message: {
    fontSize: 18,
  },
  sender: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 18,
    flex: 1,
  },
  send: {
    alignSelf: 'center',
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rowText: {
    flex: 1,
  },
});
