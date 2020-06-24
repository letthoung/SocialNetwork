import React from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';

interface IProps {
}

const ActivitiesDashboard: React.FC<IProps> = () => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList/>
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column> 
        </Grid>
    )
}
export default observer(ActivitiesDashboard);
