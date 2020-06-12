import React, { useState, useEffect, Fragment, SyntheticEvent, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import agent from '../api/agent';
import './styles.css';
import { LoadingComponent } from './LoadingComponent';
import  ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
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
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent inverted={true} content='Loading activities...' />
    
  return (
    <Fragment>
      <NavBar openCreateForm={handleCreateForm}/>
      <Container style={{marginTop: '7em'}}>
        <ActivitiesDashboard 
          activities={activityStore.activities} 
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

export default observer(App);
