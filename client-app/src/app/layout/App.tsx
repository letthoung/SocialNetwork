import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivitiesDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import './styles.css';
import { LoadingComponent } from './LoadingComponent';
import  ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent inverted={true} content='Loading activities...' />
    
  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivitiesDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
