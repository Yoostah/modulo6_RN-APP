import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Keyboard, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveButton,
  Actions,
  WarningMessage,
} from './styles';

export default class Main extends Component {
  static navigationOptions = {
    title: 'Usuários',
  };

  constructor() {
    super();

    this.state = {
      newUser: '',
      users: [],
      loading: false,
      error: '',
    };
  }

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true });

    try {
      const response = await api.get(`/users/${newUser}`);

      const checkUserExists = users.filter(user => {
        return user.login === response.data.login;
      });

      if (checkUserExists.length) {
        this.setState({ error: 'Usuário já cadastrado', loading: false });
        Keyboard.dismiss();
        return;
      }

      const data = {
        name: response.data.name,
        bio: response.data.bio,
        login: response.data.login,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
        error: '',
      });

      Keyboard.dismiss();
    } catch (error) {
      this.setState({ error: error.message, loading: false });
      Keyboard.dismiss();
    }
  };

  handleNavigate = user => {
    const { navigation } = this.props;
    navigation.navigate('User', { user });
  };

  handleDeleteUser = async login => {
    const { users } = this.state;
    const data = users.filter(user => {
      return user.login !== login;
    });

    this.setState({
      users: data,
    });
  };

  render() {
    const { users, newUser, loading, error } = this.state;
    return (
      <Container>
        <WarningMessage>{error !== '' ? error : null}</WarningMessage>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>
              <Actions>
                <ProfileButton
                  onPress={() => {
                    this.handleNavigate(item);
                  }}
                >
                  <ProfileButtonText>Ver Perfil</ProfileButtonText>
                </ProfileButton>
                <RemoveButton
                  onPress={() => {
                    this.handleDeleteUser(item.login);
                  }}
                >
                  <Icon name="delete-forever" size={20} color="#FFF" />
                </RemoveButton>
              </Actions>
            </User>
          )}
        />
      </Container>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
