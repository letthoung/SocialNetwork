import React, { SyntheticEvent, useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import { ActivityForm } from '../form/ActivityForm';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
    activities: IActivity[],
    setEditMode: (editMode: boolean) => void,
    setSelectedActivity: (selectedActivity: IActivity | null) => void,
    editActivity: (activity: IActivity) => void,
    deleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void,
    submitting: boolean,
    target: string
}

const ActivitiesDashboard: React.FC<IProps> = 
    ({activities, setSelectedActivity,
        setEditMode, editActivity, deleteActivity, submitting, target}) => {
    
    const { selectedActivity, editMode } = useContext(ActivityStore);
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList
                submitting={submitting} 
                deleteActivity={deleteActivity}
                target={target} />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode 
                    && <ActivityDetails 
                        setEditMode={setEditMode} 
                        setSelectedActivity={setSelectedActivity} />}
                {editMode 
                && <ActivityForm key={(selectedActivity && selectedActivity.id) || 0} 
                    setEditMode={setEditMode} selectedActivity={selectedActivity!} 
                    editActivity={editActivity} submitting={submitting} />}    
            </Grid.Column> 
        </Grid>
    )
}
export default observer(ActivitiesDashboard);
