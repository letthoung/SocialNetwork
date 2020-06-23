import { IActivity } from './../models/activity';
import { observable, action, computed } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial: boolean = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }
    
    @action setSubmitting = (s: boolean) => {
        this.submitting = s;
    }

    @action setEditMode = (e: boolean) => {
        this.editMode = e;
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('.')[0];
                this.activityRegistry.set(activity.id, activity);
            });
            this.loadingInitial = false;
        } catch(error){
            console.log(error);
            this.loadingInitial = false;
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            agent.Activities.update(activity).then(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
              })
        } catch (error) {
            console.log(error);
            this.submitting = false;
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            this.activityRegistry.delete(id);
            this.submitting = false;
            this.target = '';
        } catch (err) {
            console.log(err);
            this.submitting = false;
            this.target = '';
        }
    }

    @action setSelectedActivity = (activity: IActivity | null) => {
        if (activity !== null)
            this.selectedActivity = activity;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            this.activityRegistry.set(activity.id, activity);
            this.editMode = false;
            this.submitting = false;
        } catch (error) {
            this.editMode = false;
            this.submitting = false;
        }
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    }
}

export default createContext(new ActivityStore());