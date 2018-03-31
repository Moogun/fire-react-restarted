import React from 'react'
import { Segment,Container, Button, Grid, Input } from 'semantic-ui-react'
const newQButton = {paddingLeft: '0.5rem'}

const QSearch = (props) =>
  // <Segment basic>
  //   <Container text>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <Input type="text" fluid icon="search" placeholder="search" onChange={props.change} loading={props.isLoading}/>
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="middle" style={newQButton}>
            <Button size="large" onClick={props.click} color='red'>New question</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
  //   </Container>
  // </Segment>

export default QSearch
