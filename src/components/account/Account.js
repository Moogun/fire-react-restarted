import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Link, Route, Switch, Redirect} from 'react-router-dom'
import withAuthorization from '../../HOC/withAuthorization';
import profile from '../../assets/profile-lg.png'
import * as routes from '../../constants/routes';
import * as style from '../../style/inline';

import Profile from './Profile'
import Photo from './Photo'
import PasswordForgetPage from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import Danger from './Danger'
import {db} from '../../firebase';
import {storage} from '../../firebase/firebase';

import { Container, Menu, Grid, Image, Responsive, Segment, Header, Icon, Sidebar, Modal, Button} from 'semantic-ui-react'

import ReactCrop, { makeAspectCrop }  from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

const byPropKey = (propertyName, value) => ()=> ({
  [propertyName]: value
})

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      uid: '',
      email: '',
      username: '',
      displayName: '',
      photoUrl: '',
      visible: false,
      dimmed: false,

      cropperModalOpen: false,
      crop: {
        x: 0,
        y: 0,
        height: 50,
        width: 50,
      }
    };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    this.toggleVisibility()
  }

  componentDidMount(){
    console.log('did mount');
    const {authUser} = this.context
    db.onceGetUser(authUser.uid)
      .then(res => {
           // console.log('res', res.val())
           this.setState ({
              user: res.val(),
              uid: authUser.uid,
              email: res.val().email,
              username: res.val().username,
              displayName: res.val().displayName,
              photoUrl: res.val().photoUrl ? res.val().photoUrl : profile,
              images: {},
            })
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
        console.log('res', res.val())
        if (res.val() === null) {
          db.doUpdateUserProfile(uid, username, displayName)
            .then(res => {
              console.log('res update user profile', res)
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

  handlePhotoChange = (e) => {
    //select image
    // pass it to cropper
    const {images} = this.state
    let img = {}
    let newKey = db.newKey();
    //1. seclect added file
    console.log(e.target.files[0]);
    let reader = new FileReader()
    let file =  e.target.files[0]
    console.log('[file]', file, file.name);
    //2. seclected file load complete ?
    reader.onloadend = () => {
      console.log('reader', reader.result);
      img[newKey] = { file: file, imagePreviewUrl: reader.result, progress: 0}
      this.setState ({imageBeforeCropping: img})
    }

    // 3. if selected file === true, give a sign for
    if(e.target.files[0]){
      reader.readAsDataURL(file)
    }
    //
    console.log('handle change');
    this.setState ({cropperModalOpen: true })
  }

  onChange = (crop) => {
   this.setState({ crop });
  }

   onImageLoaded = (image) => {
     const crop = makeAspectCrop({
        x: 0,
        y: 0,
        aspect: 1,
        width: 50,
      }, image.width / image.height);

      this.setState({ crop, image: image });
    }

  // onCropComplete = (crop, pixelCrop) => {
  //
  // }

  handleSelect = (e) => {
    e.preventDefault()

    // console.log('onCropComplete, pixelCrop:', pixelCrop);
      const {image, crop } = this.state

      const sX = this.state.image.naturalWidth * (crop.x / 100);
      const sY = this.state.image.naturalHeight * (crop.y / 100);
      const croppedImgWidth = this.state.image.naturalWidth * (crop.width / 100);
      const croppedImgHeight = this.state.image.naturalHeight * (crop.height / 100);

      const canvas = document.createElement('canvas');
      canvas.width = croppedImgWidth;
      canvas.height = croppedImgHeight;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        this.state.image,
        sX,
        sY,
        croppedImgWidth,
        croppedImgHeight,
        0,
        0,
        croppedImgWidth,
        croppedImgHeight
      );

      const { imageBeforeCropping } = this.state
      let imageKey
      // let image
      let filename
      let type
      if (!!imageBeforeCropping && !!Object.keys(imageBeforeCropping)) {
        imageKey = Object.keys(imageBeforeCropping)[0]
        filename = imageBeforeCropping[imageKey].file.name
        type = imageBeforeCropping[imageKey].file.type;
      }

      const base64Image = canvas.toDataURL(type)

      canvas.toBlob((blob) => {
          imageBeforeCropping[imageKey].file = new File([blob], filename)
          imageBeforeCropping[imageKey].imagePreviewUrl = base64Image
          imageBeforeCropping[imageKey].progress = 0
          this.setState ({ images: imageBeforeCropping, cropperModalOpen: false, })
      }, type);
  }

  onPhotoSubmit = () => {
    const { uid } = this.state
    const {images} = this.state
    // const {teacherId, courseId } = this.props

    Object.keys(images).map(i => {
      console.log('images[i]', 'i', i, 'file', images[i].file, images[i].progress)

      var uploadTask= storage.ref().child('images').child(images[i].file.name).put(images[i].file)
      uploadTask.on('state_changed', (snapshot) => {
        // console.log('snapshot', snapshot.bytesTransferred);
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running progress', progress);
            let roundedProgress = Math.round(progress)
            images[i].progress = roundedProgress
            console.log('images[i]', images[i].progress);
            this.setState ({ images }) //called multiple tiems
            break;
          }
      }, (error) => {
          switch (error.code) {
             case 'storage/unauthorized':
               // User doesn't have permission to access the object
               break;
             case 'storage/canceled':
               // User canceled the upload
               break;
             case 'storage/unknown':
               // Unknown error occurred, inspect error.serverResponse
               break;
           }
      }, () => {
        var downloadURL = uploadTask.snapshot.downloadURL;
          console.log('down', downloadURL);
          db.doUpdateUserPhoto(uid, downloadURL)
             .then(res => this.setState ({photoUrl: downloadURL }))
             .catch(error => {
               this.setState(byPropKey('error', error));
             })
      })
    })
  }
  componentWillUnMount(){
    console.log('account will un mount 1');
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible, dimmed: !this.state.dimmed })

  render() {
    const {match} = this.props
    // console.log('account props',this.props.match, this.props.user);
    // console.log('account authUser',this.context.authUser);
    const {authUser} = this.context
    const { activeItem, //menu
      user, email, username, displayName, photoUrl, usernameTaken, images, //sub menu
      visible, dimmed, // mobile toggle
      imageBeforeCropping,
    } = this.state

    // console.log('[render]images', !!images && !! Object.keys(images)[0] ? images[Object.keys(images)[0]].imagePreviewUrl : null );

    return (
      <div>
        <Responsive {...Responsive.onlyComputer}>
        <Container text style={style.ACCOUNT_MIN_HEIGHT}>
          <Grid celled stackable>
            <Grid.Row centered>
              <Grid.Column width={4}>
                  <Menu vertical secondary fluid>
                  <br/>
                  <Image src={photoUrl} circular centered size='small'/>
                  <br/>
                  <Menu.Item name='profile'
                    as={Link}
                    to={`${match.url}/profile`}
                    active={activeItem === 'profile'}
                    onClick={this.handleItemClick}
                   />
                  <Menu.Item name='photo'
                    as={Link} to={`${match.url}/photo`}
                      active={activeItem === 'photo'} onClick={this.handleItemClick}
                   />
                   <Menu.Item name='passwordChange'
                    // as={Link} to='/account/passwordChange'
                     as={Link} to={`${match.url}/pw-change`}
                      active={activeItem === 'passwordChange'} onClick={this.handleItemClick}
                  />
                  <Menu.Item name='passwordForget'
                   // as={Link} to='/account/passwordForget'
                    as={Link} to={`${match.url}/pw-forget`}
                     active={activeItem === 'passwordForget'} onClick={this.handleItemClick}
                   />
                  <Menu.Item name='danger'
                    as={Link} to={`${match.url}/danger`}
                    active={activeItem === 'danger'} onClick={this.handleItemClick}
                   />
                </Menu>
              </Grid.Column>

              <Grid.Column width={12}>
                <Switch>
                  <Redirect exact from={match.url} to={routes.ACCOUNT_PROFILE} />
                  <Route path={routes.ACCOUNT_PROFILE} render={(props) => <Profile {...props}
                    user={user}
                    email={email}
                    username={username}
                    usernameTaken={usernameTaken}
                    displayName={displayName}
                    change={this.handleProfileInfoChange}
                    submit={this.onProfileInfoSubmit}
                    />} />
                  <Route path={routes.ACCOUNT_PHOTO} render={() => <Photo
                    image={images}
                    photo={photoUrl}
                    photoChange={this.handlePhotoChange}
                    submit={this.onPhotoSubmit}
                    />} />
                  <Route path={routes.ACCOUNT_PASSWORD_CHANGE} render={ () => <PasswordChangeForm />} />
                  <Route
                    path={routes.ACCOUNT_PASSWORD_FORGET}
                    render={ () => <PasswordForgetPage />} />
                  <Route path={routes.ACCOUNT_DANGER} render={() => <Danger />} />
                </Switch>
              </Grid.Column>

            </Grid.Row>
          </Grid>
        </Container>
        </Responsive>

        <Responsive minWidth={320} maxWidth={992}>
            <Grid>
              <Grid.Column>
                   <Container>
                      <Segment basic clearing style={{paddingLeft: '0', paddingRight: '0'}}>
                          <Header as='h5' floated='left' style={{marginBottom: '0'}}>
                            <Image circular src={photoUrl ? photoUrl : profile} size='tiny'/>
                            <Header.Content>
                              {user.username}
                              <Header.Subheader>
                                {user.email}
                              </Header.Subheader>
                            </Header.Content>
                         </Header>
                         <Header as='h5' floated='right' onClick={this.toggleVisibility}>
                            <Icon name='ellipsis vertical'/>
                          </Header>
                    </Segment>

                  </Container>
                  <Sidebar.Pushable
                    // as={Segment}
                    >
                     <Sidebar
                       as={Menu}
                       animation='push'
                       width='thin'
                       direction='top'
                       visible={visible}
                       icon='labeled'
                       vertical
                       inverted
                     >
                       <br/>
                       <Menu.Item name='profile'
                         as={Link} to={`${match.url}/profile`}
                         active={activeItem === 'profile'}
                         onClick={this.handleItemClick}
                        />
                       <Menu.Item name='photo'
                           as={Link} to={`${match.url}/photo`}
                           active={activeItem === 'photo'}
                           onClick={this.handleItemClick}
                        />
                        <Menu.Item name='passwordChange'
                          as={Link} to={`${match.url}/pw-change`}
                           active={activeItem === 'passwordChange'} onClick={this.handleItemClick}
                       />
                       <Menu.Item name='passwordForget'
                         as={Link} to={`${match.url}/pw-forget`}
                          active={activeItem === 'passwordForget'} onClick={this.handleItemClick}
                        />
                       <Menu.Item name='danger'
                         as={Link} to={`${match.url}/danger`}
                         active={activeItem === 'danger'} onClick={this.handleItemClick}
                        />

                     </Sidebar>
                     <Sidebar.Pusher dimmed={dimmed}>
                       {/* <Segment basic> */}
                           <Switch>
                             <Redirect exact from={match.url} to={routes.ACCOUNT_PROFILE} />
                             <Route path={routes.ACCOUNT_PROFILE} render={(props) => <Profile {...props}
                               user={user}
                               email={email}
                               username={username}
                               usernameTaken={usernameTaken}
                               displayName={displayName}
                               change={this.handleProfileInfoChange}
                               submit={this.onProfileInfoSubmit}
                               />} />
                             <Route path={routes.ACCOUNT_PHOTO} render={() => <Photo
                               image={images}
                               photo={photoUrl}
                               photoChange={this.handlePhotoChange}
                               submit={this.onPhotoSubmit}
                               />} />
                             <Route path={routes.ACCOUNT_PASSWORD_CHANGE} render={ () => <PasswordChangeForm />} />
                             <Route
                               path={routes.ACCOUNT_PASSWORD_FORGET}
                               render={ () => <PasswordForgetPage />} />
                             <Route path={routes.ACCOUNT_DANGER} render={() => <Danger />} />
                         </Switch>
                       {/* </Segment> */}
                     </Sidebar.Pusher>
                   </Sidebar.Pushable>
              </Grid.Column>
            </Grid>
          </Responsive>

          <Modal open={this.state.cropperModalOpen} size='tiny'>
            {/* <Modal.Header>Select a Photo</Modal.Header> */}
            <Modal.Content>
              {!!imageBeforeCropping && !! Object.keys(imageBeforeCropping)[0]
                ? <ReactCrop
                  src={imageBeforeCropping[Object.keys(imageBeforeCropping)[0]].imagePreviewUrl}
                  crop={this.state.crop}
                 onImageLoaded={this.onImageLoaded}
                 onChange={this.onChange}
                 // onComplete={this.onCropComplete}
               />
               : null
             }
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => this.setState ({ cropperModalOpen: false})}> Cancel</Button>
              <Button onClick={this.handleSelect}> Done</Button>

            </Modal.Actions>
          </Modal>
  </div>
    );
  }
}

AccountPage.contextTypes ={
  authUser: PropTypes.object,
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
