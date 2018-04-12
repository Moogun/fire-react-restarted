import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Segment, Container, Header, Icon, Menu, Image, Grid, Breadcrumb, Rating} from 'semantic-ui-react'
import {Link, Route, withRouter, Switch, Redirect} from 'react-router-dom'
import Courses from './Courses'
import Questions from './Questions'
import NewQ from '../questions/NewQ'
import CoursePage from '../coursePage/CoursePage'
import profile from '../../assets/profile-lg.png'
import {db} from '../../firebase';

const NEW_Q = {
  text: '',
  title:'',
  cid: '',
  error: null,
}

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

let QUESTIONS =  {
      "-L8aaR70p5Bgq7VQMNrM" : {
        "answers" : {
          "-L8dxagSnECUBEd4JzIW" : {
            "answerText" : "abc",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8dxeqnRdVvwiIJ0Os1" : {
            "answerText" : "speicfy your question",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8dxxUKHMcG6VLy45eo" : {
            "answerText" : "how much more I can do with it",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8dyBKSAgIqjvvWPVeG" : {
            "answerText" : "ooo",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8dyDwcnVR-ddNn6RZl" : {
            "answerText" : "answerText",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8dyR3OYLQqyq4WJciG" : {
            "answerText" : "answerText",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8eAMhtWD0ca-LHNRLo" : {
            "answerText" : "answerText",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8eAPHmdX3wszsxSjen" : {
            "answerText" : "answerText",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8eAir61Y-B9Apa6hBo" : {
            "answerText" : "come on 10 18",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          },
          "-L8eAsahRjGbGoxCnLFf" : {
            "answerText" : "you know ",
            "answeredBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
            "createdAt" : "2days ago",
            "img" : "img"
          }
        },
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "다 알려줘요\n",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "마케팅 "
      },
      "-L8aaa9vhLSxJujhaSks" : {
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "빨리 빨리 ",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "궁금궁금"
      },
      "-L8aacXheofG12rstxOK" : {
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "속도 속도",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "왜이래"
      },
      "-L8aahDyHCDPUI8laJ3A" : {
        "answers" : {
          "-L8q3mBSDn--XTHmDvf7" : {
            "answeredBy" : "dgNwJUgPP7OjuMglkK7Uqcm1ha92",
            "createdAt" : "2days ago",
            "img" : "img",
            "text" : "글쎄 확실합니까?"
          }
        },
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "오타 맞죠?",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "책 47page  오타"
      },
      "-L8aajPpJnUyENhpsgG3" : {
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "오타 맞죠?",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "책 47page  오타"
      },
      "-L8acbX0f2tZvP2HHdGJ" : {
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hJU4ocZI02GZ6nAm8",
        "createdAt" : "createdAt",
        "text" : "어려워\n",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "그로스 해킹이 뭥미? "
      },
      "-L8acg-TkYSkmv1X3P0H" : {
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hJU4ocZI02GZ6nAm8",
        "createdAt" : "createdAt",
        "text" : "어려워요",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "애널리틱스는 전문가만 하는거 아닌가요?"
      },
      "-L8ack1h1UUFWOjxeB8u" : {
        "askedBy" : "MxbMJw31WCUsU0v5GOWMTqwcApR2",
        "cid" : "-L7hJU4ocZI02GZ6nAm8",
        "createdAt" : "createdAt",
        "text" : "1박2일인가요?",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "캠프면 1박 2일 인가요"
      },
      "-L8plEUaWSPqNa4ue-je" : {
        "askedBy" : "dgNwJUgPP7OjuMglkK7Uqcm1ha92",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "마케팅이란 무엇인가?  알려주세요",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "마케팅이란 무엇인가? "
      },
      "-L8plMOn65W45JUY-6Yh" : {
        "askedBy" : "dgNwJUgPP7OjuMglkK7Uqcm1ha92",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "무엇을 했는지 알려주세요 ",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "어제 오늘ㅁ"
      },
      "-L8plQ3v9s2LgfCpfptw" : {
        "askedBy" : "dgNwJUgPP7OjuMglkK7Uqcm1ha92",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "1박2일 캠프인가?",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "캠프면"
      },
      "-L8plT6DxWbany2sEM3E" : {
        "askedBy" : "dgNwJUgPP7OjuMglkK7Uqcm1ha92",
        "cid" : "-L7hItXjIZxClZtpg9dQ",
        "createdAt" : "createdAt",
        "text" : "못참아요",
        "tid" : "RQg9vzBgQ0bej5MhICRNqSSrRdz1",
        "title" : "궁금한 것은 못참아"
      }
    }

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'courses',
      teacherId: '',
      tName: '',
      cTeaching: '',
      questions: QUESTIONS,
      answersGiving: [],
      NEW_Q: NEW_Q,
      error: null,
    };
  }

  //menu selection
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  //navigation  courses, questions, new question
  handleCourseClick = (id, tName, cTitle) => {
    console.log('teacher', id, tName, cTitle);
    let title = cTitle.replace(/\s+/g, '-');
    this.props.history.push('/' + tName + '/' + title)
  }

  handleQuestionClick = (qid) => {
    const { questions } = this.state
    console.log('teacher q click', qid);
    console.log('teacher q click',questions[qid]);
    this.props.history.push({
      pathname: `${this.props.match.url}/question/${qid}`,
      state:
        {
          q: questions[qid],
          qid: qid
        }
    })
  }

  handleNewQ = () => {
    this.props.history.push(`${this.props.match.url}/new-question`)
  }

  // new question methods

  handleQuestionChange = (e, { value }) => {
    this.setState({[e.target.name]: e.target.value})
    e.preventDefault()
  }

  handleQuestionSubmit = (event) => {

    const {teacherId, title, text, cid} = this.state;
    const {authUser} = this.context

    console.log(teacherId, 'on submit title, text', title, text, cid);

    db.doSaveNewQ(teacherId, cid, authUser.uid, title, text, "createdAt", 'img')
      .then(res => console.log('res', res))
      .catch(error => {
        this.setState(byPropKey('error', error))
      })

    event.preventDefault();
  }

  handleCourseSelect = (e, {value}) => {
    this.setState({cid: value})
    e.preventDefault()
  }

  handleSearchQueryChange =(value) => {

    this.setState({ isLoading: true, value })
    setTimeout( () => {
      const {teacherId} = this.state
      db.doSearchForQuestions(teacherId, value)
        .then(res => {
          let searchResult = res.val()
          if (searchResult){
            console.log('search result', 1);
            this.saveFechedQuestionsToState(searchResult)
          } else {
            console.log('search result', 2);
            this.setState({questions: null})
          }
          this.setState({ isLoading: false,  })
          // console.log('search', res.val())
        })
    }, 1000)
  }

  handleFetchQuestions = () => {
    const {teacherId} = this.state
    db.doFetchRecentQuestions(teacherId)
      .then(snap => {
        // this.setState({questions: res.val() })}
        let qList = snap.val()
        this.saveFechedQuestionsToState(qList)
      })
      .catch(error => {
        this.setState(byPropKey('error', error))
      })
  }

  saveFechedQuestionsToState = (qList) => {
    console.log('save fetched q to state qlist', qList);
    Object.keys(qList).map(key => {
      let askedBy = qList[key].askedBy
      db.onceGetUser(askedBy)
        .then(userSnap => {
          let username = userSnap.val().username
          qList[key].username = username
          // console.log('handle fetch questions, ', qList);
          this.setState({questions: qList})
        })

      if (qList[key].answers){
        // console.log('qList[key].answers', qList[key].answers);
        Object.keys(qList[key].answers).map(aid => {
          let answeredBy = qList[key].answers[aid].answeredBy
          // console.log('answeredBy', answeredBy);
          db.onceGetUser(answeredBy)
            .then(userSnap => {
              let username = userSnap.val().username
              qList[key].answers[aid].username = username
              this.setState({questions: qList })
            })
        })
      }
    })
  }

  //life cycle methods
  componentWillUnmount(){
    console.log(0);
  }

  componentDidMount(){
    const {tName} = this.props.match.params
    let teacherId
    db.onceGetUserWithName(tName)
      .then(tSnap => {
        let t = tSnap.val()
        // console.log('t did mount',t );
        teacherId = Object.keys(tSnap.val())
        // console.log('t did mount key', teacherId);
        let cTeaching = t[teacherId].courseTeaching

        let selectOption=[]
        let item;

        Object.keys(cTeaching).map(key => {
          item={key: key, text: cTeaching[key].metadata.title, value: key}
          selectOption.push(item)
        })

        this.setState ({ cTeaching: cTeaching, teacherId: teacherId[0],
          'selectOption': selectOption
        })
        this.handleFetchQuestions()
      }).catch(error => {
        this.setState(byPropKey('error', error))
      })
  }

  componentWillUnmount(){
    console.log('will un mount 0 ', )
  }

  render() {
    const {} = this.state
    const {match} = this.props
    const {tName} = this.props.match.params
    const { activeItem, teacherId, cTeaching, selectOption, questions, isLoading } = this.state
    // console.log('teacher render 1 questions', questions )

    return (
      <Grid style={{backgroundColor: '#ecf0f1', marginTop: '0rem' }}>
        <Grid.Row style={{paddingTop: '0rem'}}>
            <Grid.Column>

               {/* <Breadcrumb style={{marginTop: '2em' }}>
               <Breadcrumb.Section link as={Link} to='/'> Home </Breadcrumb.Section>
               <Breadcrumb.Divider icon='right angle' />
               <Breadcrumb.Section>{tName}</Breadcrumb.Section>
               </Breadcrumb> */}

               <Grid
                 style={{ backgroundColor: '#34495e', marginTop: '0rem'}} stackable centered
                 >
                   <Grid.Column width={12} >
                       <Segment basic style={{margin: '2em' }} >
                         <Header as='h1'
                           // style={{color: '#fff'}}
                           content={tName}
                           subheader='Profile' />
                           <Rating icon='star' defaultRating={5} maxRating={4} />
                           <p> '000 reviews' </p>
                       </Segment>
                     </Grid.Column>

                     {/* <Grid.Column width={3} textAlign='center'>
                       <Image src={profile} circular centered/>
                     </Grid.Column>
                     <Grid.Column width={1}>
                     </Grid.Column> */}
                   </Grid>

                   <Grid style={{ backgroundColor: '#ecf0f1', marginTop: '0rem'}} stackable centered>
                    <Grid.Column width={12}>
                      <Segment basic>
                        <Menu size='large' inverted>
                          <Container>
                            <Menu.Item
                              name='course'
                              active={activeItem === 'courses'}
                              onClick={this.handleItemClick}
                              as={Link} to={`${match.url}/courses`}>Courses</Menu.Item>
                            <Menu.Item
                              name='question'
                              active={activeItem === 'questions'}
                              onClick={this.handleItemClick}
                              as={Link} to={`${match.url}/questions`}>Questions</Menu.Item>
                            <Menu.Item
                              name='story'
                              active={activeItem === 'story'}
                              onClick={this.handleItemClick}
                              as={Link} to={`${match.url}/story`}>Story</Menu.Item>
                            <Menu.Item
                              name='review'
                              active={activeItem === 'review'}
                              onClick={this.handleItemClick}
                              as={Link} to={`${match.url}/story`}>Review</Menu.Item>
                            </Container>
                          </Menu>
                         </Segment>
                      </Grid.Column>
                 </Grid>


                 <Grid style={{ backgroundColor: '#ecf0f1', marginTop: '0rem'}} stackable centered>
                  <Grid.Column width={12}>

                        <Switch>
                          <Redirect exact strict from={match.url} to={`${match.url}/courses`} />
                          <Route path={`${match.url}/courses`} render={() =>
                            <Courses
                              tName={tName}
                              cTeaching={cTeaching}
                              click={this.handleCourseClick}
                            />} />
                          <Route path={`${match.url}/questions`} render={ (props) =>
                                <Questions
                                  tid={teacherId}
                                  questions={questions}
                                  click={this.handleNewQ} {...props}
                                  queClick={this.handleQuestionClick}
                                  searchQueryChange={this.handleSearchQueryChange}
                                  isLoading={isLoading}
                                />} />
                         <Route path={`${match.url}/new-question`} render={() =>
                           <NewQ
                             tid={teacherId}
                             cTeaching={cTeaching}
                             selectOption={selectOption}
                             submit={this.handleQuestionSubmit}
                             change={this.handleQuestionChange}
                             chooseCourse={this.handleCourseSelect}
                           />} />
                       </Switch>

                     </Grid.Column>
                   </Grid>

           </Grid.Column>
       </Grid.Row>
     </Grid>

    //         <Header
    //           as='h1'
    //           content='Teacher Name'
    //           // inverted
    //           style={{
    //             // fontSize: mobile ? '2em' : '3em',
    //             fontWeight: 'normal',
    //             // color: 'white',
    //             // marginBottom: mobile ? '1.5em' : '1.5em',
    //             // marginTop: mobile ? '1.5em' : '1em',
    //             marginTop: '2em',
    //           }}
    //           // color='yellow'
    //         />
    );
  }
}

Teacher.contextTypes ={
  authUser: PropTypes.object,
}

export default withRouter(Teacher)
