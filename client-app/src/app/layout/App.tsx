import React, { useState, useEffect, Fragment, SyntheticEvent, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import { ActivitiesDashboard } from '../../features/activities/dashboard/ActivitiesDashboard';
import agent from '../api/agent';
import './styles.css';
import { LoadingComponent } from './LoadingComponent';
import  ActivityStore from '../stores/activityStore';

const App: React.FC = () => {
  const {title} = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [target, setTarget] = useState<string>('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  }

  const handleCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() =>{
      setActivities([...activities, activity]);
      setEditMode(false);
      setSelectedActivity(activity);
    }).then(() => setSubmitting(false))
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
      setEditMode(false);
      setSelectedActivity(activity);
    }).then(() => setSubmitting(false))
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() =>
      setActivities(activities.filter(a => a.id !== id)))
      .then(() => setSubmitting(false))
  }

  useEffect(() => {
    agent.Activities.list()
        .then(response => {
          let activities: IActivity[] = [];
          response.forEach(activity => {
            activity.date = activity.date.split('.')[0];
            activities.push(activity)
          })
          setActivities(activities);
        })
        .then(() => setLoading(false))
  }, []);

  if (loading) return <LoadingComponent inverted={true} content='Loading activities...' />
    
  return (
    <Fragment>
      <NavBar openCreateForm={handleCreateForm}/>
      <Container style={{marginTop: '7em'}}>
        <h1>{title}</h1>
        <ActivitiesDashboard 
          activities={activities} 
          selectActivity={handleSelectActivity} 
          selectedActivity={selectedActivity} 
          editMode = {editMode}
          setEditMode = {setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity} 
          submitting={submitting}
          target={target}/>
      </Container>
    </Fragment>
  );
}

export default App;
