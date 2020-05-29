import React from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { ActivityList } from './ActivityList'
import { ActivityDetails } from '../details/ActivityDetails'
import { ActivityForm } from '../form/ActivityForm'

interface IProps {
    activities: IActivity[],
    selectActivity: (id: string) => void,
    selectedActivity: IActivity
}

export const ActivitiesDashboard: React.FC<IProps> = ({activities, selectActivity, selectedActivity}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities} selectActivity={selectActivity} ></ActivityList>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetails selectedActivity={selectedActivity} />
                <ActivityForm />    
            </Grid.Column> 
        </Grid>
    )
}
