import { IActivity } from './../models/activity';
import { observable, action } from 'mobx';
import { createContext } from 'react';
import agent from '../api/agent';

class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable selectedActivities: IActivity | undefined;
    @observable loadingInitial: boolean = false;
    @observable editMode = false;
    
    @action loadActivities = () => {
        this.loadingInitial = true;
        agent.Activities.list()
        .then(activities => activities.forEach(activity => {
            activity.date = activity.date.split('.')[0];
            this.activities.push(activity)
          }))
        .finally(() => this.loadingInitial = false)
    }

    @action selectActivity = (id: string) => {
        this.selectedActivities = this.activities.find(activity => activity.id === id);
        this.editMode = false;
    }
}

export default createContext(new ActivityStore());