import React, {Component} from 'react'
import QSearch from '../questions/QSearch'
import QuestionTable from '../questions/QuestionTable'
import profile from '../../assets/profile-lg.png'
import { Grid, Container, Responsive} from 'semantic-ui-react'

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: null,
    }
  }

  handleNewQ = () => {
    this.props.click()
  }

  handleQuestionClick = (qid) => {
    this.props.queClick(qid)
  }

  handleSearchQueryChange = (e) => {
    // console.log(e.target.value);
    this.props.searchQueryChange(e.target.value)
    e.preventDefault()
  }

  render() {
    const {tid, questions, searchClick, isLoading} = this.props
    // console.log('question render 1 ', questions )
    let qTable = questions ? <QuestionTable tid={tid} questions={questions} click={this.handleQuestionClick} />
     : <p>no question yet</p>
    return (
        <div>
          <Responsive {...Responsive.onlyComputer}>
             <Container text>

            <QSearch
              tid={tid}
              click={() => this.props.click()} change={this.handleSearchQueryChange}
              searchClick={this.handleSearchClick}
              isLoading={isLoading}/>

              {qTable}
            </Container>
          </Responsive>
          <Responsive minWidth={320} maxWidth={991}>
            <Container>

              <QSearch
                tid={tid}
                click={() => this.props.click()} change={this.handleSearchQueryChange}
                searchClick={this.handleSearchClick}
                isLoading={isLoading}/>

                {qTable}
            </Container>
          </Responsive>
        </div>
    );
  }
}

export default Questions;
