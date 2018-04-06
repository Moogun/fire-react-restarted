import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Link, Route, Switch, Redirect} from 'react-router-dom'
import withAuthorization from '../../HOC/withAuthorization';
import profile from '../../assets/profile-lg.png'

import Profile from './Profile'
import Photo from './Photo'
import {PasswordForgetForm} from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import Danger from './Danger'
import {db} from '../../firebase';

import { Container, Menu, Grid, Image} from 'semantic-ui-react'

const byPropKey = (propertyName, value) => ()=> ({
  [propertyName]: value
})

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  componentDidMount(){
    console.log('did mount');
    const {authUser} = this.context
    db.onceGetUser(authUser.uid)
      .then(res => {
           console.log('res', res.val())
           this.setState ({
              user: res.val(),
              uid: authUser.uid,
              email: res.val().email,
              username: res.val().username,
              displayName: res.val().displayName,
              photoUrl: res.val().photoUrl ? res.val().photoUrl : profile, })
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      })
  }

  handleProfileInfoChange = (event) => {
    this.setState(byPropKey(event.target.name, event.target.value))
    this.setState ({
      usernameTaken: null,
    })
  }

  onProfileInfoSubmit = () => {
    const { uid, username, displayName} = this.state
    db.doSearchForUsername(username)
      .then(res => {
        console.log('res', res)
        if (res.val() === null) {
          db.doUpdateUserProfile(uid, username, displayName)
            .then(res => {
              console.log('res', res)
              this.setState ({ buttonContent: 'Saved'})
            })
            .catch(error => {
              this.setState(byPropKey('error', error));
            });
        } else {
          this.setState ({ usernameTaken: username + ' is already taken'})
        }
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });
  }

  render() {
    const {match} = this.props
    console.log('account props',this.props.match);
    // console.log('account authUser',this.context.authUser);
    const {authUser} = this.context
    const { activeItem, user, email, username, displayName, photoUrl, usernameTaken } = this.state
    console.log('photoUrl', photoUrl);

    return (
      <Container text>
        <Grid celled stackable>
          <Grid.Row centered>
            <Grid.Column width={4}>
                <Menu vertical secondary fluid>
                <br/>
                <Image src={photoUrl} circular centered fluid/>
                <br/>
                <Menu.Item name='profile'
                  active
                  // as={Link} to='/account/profile'
                  as={Link} to={`${match.url}/profile`}
                  active={activeItem === 'profile'} onClick={this.handleItemClick}
                 />
                <Menu.Item name='photo'
                  // as={Link} to='/account/photo'
                  as={Link} to={`${match.url}/photo`}
                    active={activeItem === 'photo'} onClick={this.handleItemClick}
                 />
                 <Menu.Item name='passwordChange'
                  // as={Link} to='/account/passwordChange'
                   as={Link} to={`${match.url}/passwordChange`}
                    active={activeItem === 'passwordChange'} onClick={this.handleItemClick}
                />
                <Menu.Item name='passwordForget'
                 // as={Link} to='/account/passwordForget'
                  as={Link} to={`${match.url}/passwordChange`}
                   active={activeItem === 'passwordForget'} onClick={this.handleItemClick}
                 />
                <Menu.Item name='danger'
                  as={Link} to='/account/danger'
                  active={activeItem === 'danger'} onClick={this.handleItemClick}
                 />
              </Menu>
            </Grid.Column>

            <Grid.Column width={12}>
              <Switch>
                <Redirect exact from={match.url} to={`${match.url}/profile`} />
                <Route path='/account/profile' render={(props) => <Profile {...props}
                  user={user}
                  email={email}
                  username={username}
                  usernameTaken={usernameTaken}
                  displayName={displayName}
                  change={this.handleProfileInfoChange}
                  submit={this.onProfileInfoSubmit}
                />}
                />
                <Route path='/account/photo' render={() => <Photo photo={photoUrl} />} />
                <Route path='/account/passwordChange' render={ () => <PasswordChangeForm />} />
                <Route path='/account/passwordForget' render={ () => <PasswordForgetForm />} />
                <Route path='/account/danger' render={() => <Danger />} />
              </Switch>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

AccountPage.contextTypes ={
  authUser: PropTypes.object,
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
