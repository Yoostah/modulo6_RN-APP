import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Repo,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Spinner,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  constructor() {
    super();

    this.state = {
      starred: [],
      loading: false,
      page: 1,
      user: '',
      refreshing: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ loading: true, user: user.login });
    const response = await api.get(`/users/${user.login}/starred`);
    if (response.data.length < 30) {
      this.setState({ starred: response.data, loading: false, page: 0 });
    } else {
      this.setState({ starred: response.data, loading: false });
    }
  }

  loadMore = async () => {
    const { page, user, starred, refreshing } = this.state;
    if (refreshing) return;

    this.setState({ refreshing: true });
    const response = await api.get(`/users/${user}/starred?page=${page + 1}`);

    if (response.data.length < 30) {
      this.setState({
        starred: [...starred, ...response.data],
        page: 0,
        refreshing: false,
      });
    } else {
      this.setState({
        starred: [...starred, ...response.data],
        page: page + 1,
        refreshing: false,
      });
    }
  };

  handleRepoPage = repo => {
    const { navigation } = this.props;
    navigation.navigate('Repo', { repo });
  };

  render() {
    const { starred, loading, refreshing, page } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Spinner>
            <ActivityIndicator size="large" color="#7159C1" />
          </Spinner>
        ) : (
          <>
            <Stars
              onEndReached={page && this.loadMore}
              onEndReachedThreshold={0.5}
              data={starred}
              keyExtractor={repo => String(repo.id)}
              renderItem={({ item }) => (
                <Repo onPress={() => this.handleRepoPage(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Repo>
              )}
            />
            {refreshing && (
              <Spinner>
                <ActivityIndicator size="large" color="#7159C1" />
              </Spinner>
            )}
          </>
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
