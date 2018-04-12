import React, {Component} from 'react';
import { Segment, Container, Grid, Header, Responsive } from 'semantic-ui-react'
import CourseCard from './CourseCard'
import Teacher from '../teacher/Teacher'
import {Route, withRouter } from 'react-router-dom'

class MyCourseCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: null,
    };
  }

  handleClick = (courseId, teacherId, title, tName) => {
    console.log('my course cards handle click');
    const { history, } = this.props;
    var titleDashed = title.replace(/\s+/g, '-')
    history.push({
      pathname: '/my' + '/' + tName + '/' + titleDashed
    })
    //event.preventDefault();
  }

  render() {
    // const {courses} = this.state
    const {courses} = this.props

    let courseList = courses ?
      <div>
        <Responsive {...Responsive.onlyComputer}>
          <Grid stackable doubling columns={3} style={{marginTop: '0em'}}>
            {Object.keys(courses).map(key =>
              <CourseCard
                key={key}
                course={courses[key]} click={() => this.handleClick( key,
                courses[key].metadata.tid,
                courses[key].metadata.title,
                courses[key].metadata.tName)} />)}
          </Grid>
        </Responsive>
        <Responsive minWidth={320} maxWidth={992}>

          <Grid>
            <Grid.Column>
            {Object.keys(courses).map(key =>
              <CourseCard
                key={key}
                course={courses[key]} click={() => this.handleClick( key,
                courses[key].metadata.tid,
                courses[key].metadata.title,
                courses[key].metadata.tName)} />)}
                </Grid.Column>
          </Grid>
        </Responsive>
        </div>
      : <p> no course</p>

    return (

        // <Grid stackable doubling columns={4} style={{marginTop: '0em'}}>
        <Container>
            {courseList}
        </Container>
        // </Grid>

    );
  }
}

export default withRouter(MyCourseCards)