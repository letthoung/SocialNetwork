import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import { ActivitiesDashboard } from '../../features/activities/dashboard/ActivitiesDashboard';
import './styles.css';

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0])
  }
  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
        .then(response => {
          setActivities(response.data);
        })
  }, []);
    
  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivitiesDashboard activities={activities} selectActivity={handleSelectActivity} selectedActivity={selectedActivity} />
      </Container>
    </Fragment>
  );
}

export default App;