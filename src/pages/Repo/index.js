import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default class Repo extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repo').name,
  });

  render() {
    const { navigation } = this.props;
    const { html_url: url } = navigation.getParam('repo');
    return <WebView source={{ uri: url }} style={{ flex: 1 }} />;
  }
}

Repo.propTypes = PropTypes.shape({
  navigation: PropTypes.func,
}).isRequired;
