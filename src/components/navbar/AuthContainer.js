import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button, Container, Divider, Grid, Header, Icon, Image, List, Menu, Responsive, Segment, Sidebar, Visibility, Dropdown, Input
} from 'semantic-ui-react'
import * as routes from '../../constants/routes';
import * as style from '../../style/inline';

import Category from './Category'
import HomepageHeading from './HomepageHeading'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {auth, db} from '../../firebase'
import logo from '../../assets/logo.png'

import MyCourseQuizTaking from '../coursePageMy/MyCourseQuizTaking';

import profile from '../../assets/profile-lg.png'

const MENU_BORDER={borderRadius: '0', marginBottom: '0'}

class AuthContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  handlePusherClick = () => {
    const { sidebarOpened } = this.state
    if (sidebarOpened) this.setState({ sidebarOpened: false })
  }

  handlePusherClickAndLogout = () => {
    const { sidebarOpened } = this.state
    if (sidebarOpened) this.setState({ sidebarOpened: false })
    auth.doSignOut()
  }

  handleToggle = () => this.setState({ sidebarOpened: !this.state.sidebarOpened })

  handleSearchField = () => this.setState ({ searchFieldActive: !this.state.searchFieldActive})

  handleSearchClick = () => { console.log('search clicked')}

  componentDidMount(){

    const {authUser} = this.props

      db.onceGetUser(authUser.uid)
      .then(res => this.setState ({ user: res.val() }))
      .then(

        db.doFetchTeaching(authUser.uid)
        .then(res => this.setState ({teachingList: res.val() }))
        .catch(error => {
          this.setState({[error]: error});
        })
      )

      .catch(error => {
        this.setState({[error]: error});
      })
  }

  render() {

    const {
      activeItem, user, teachingList, attendingCourses,
      sidebarOpened, handlePusherClick, handlePusherClickAndLogout, handleToggle,
      searchFieldActive, handleSearchField, handleSearchClick,
      } = this.state

    const { children, authUser, fixed } = this.props

    let mobile = false

    return (
      <div>

        <Sidebar.Pushable>
           <Sidebar as={Menu} animation='push' inverted vertical visible={sidebarOpened}>
             <Menu.Item
               as={Link} to={routes.ACCOUNT}
               onClick={this.handlePusherClick} >{!!user ?
                 <Header as='h5' inverted>
                   <Image circular src={!!user.photoUrl ? user.photoUrl : profile } />
                   <Header.Content>
                     {user.username}
                     <Header.Subheader>
                       {user.email}
                     </Header.Subheader>
                   </Header.Content>
                 </Header>
                 : 'My Account'
               }
             </Menu.Item>
             {/* <Menu.Item as={Link} to='/category' onClick={this.handlePusherClick}>Category</Menu.Item> */}
             <Menu.Item as={Link} to={routes.LEARNING} onClick={this.handlePusherClick}>My Courses</Menu.Item>
             <Menu.Item as={Link} to='/notifications' onClick={this.handlePusherClick}>My Notifications</Menu.Item>
             <Menu.Item as={Link} to={!!teachingList ? routes.DASHBOARD : routes.TEACHER_INTRO} onClick={this.handlePusherClick}>{!!teachingList ? 'Instructor Dashboard' : 'Are You Teaching?'} </Menu.Item>
             <Menu.Item as={Link} to={routes.FOOTER_HELP} onClick={this.handlePusherClick}>Help</Menu.Item>
             <Menu.Item as='a' onClick={this.handlePusherClickAndLogout}>Log out</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}
            onClick={this.handlePusherClick} style={{ minHeight: '100vh' }}>

            <Segment
              // inverted
              textAlign='center'
              // style={{
              //    // minHeight: 350,
              //    padding: '1em 0em'
              //  }}
              // style={NAV_MOBILE_AUTH}
              vertical
              >

                <Menu secondary>
                  <Container>
                        <Menu.Item name='weqna' active={activeItem === 'weqna'} onClick={this.handleItemClick}
                          as={Link} to={routes.HOME}>

                          {!mobile ? 'We qna' : <Icon name='heart' />}</Menu.Item>

                        <Menu.Menu position='right'>
                          <Menu.Item name='teaching' active={activeItem === 'teaching'} onClick={this.handleItemClick}
                            as={Link} to={routes.DASHBOARD}
                          > {!mobile ? 'Are you teaching?' : <Icon name='pencil' />}</Menu.Item>
                          <Menu.Item name='mycourses' active={activeItem === 'mycourses'} onClick={this.handleItemClick}
                            as={Link} to={routes.LEARNING}
                            > {!mobile ? 'My Courses' : <Icon name='folder' />}</Menu.Item>

                          <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleItemClick}
                            as={Link} to={routes.ACCOUNT}
                            > {!mobile ? 'username' : <Icon name='user outline' />}</Menu.Item>
                        </Menu.Menu>
                      </Container>
                      </Menu>

              {/* <HomepageHeading mobile /> */}
            </Segment>
          {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>

      </div>
    )
  }
}

AuthContainer.propTypes = {
  children: PropTypes.node,
}

export default AuthContainer
