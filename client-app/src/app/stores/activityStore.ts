import { IActivity } from './../models/activity';
import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';

configure({enforceActions: "always"})

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable activity: IActivity | null = null;
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
            runInAction('loading activities',() => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            })
        } catch(error){
            runInAction('load activities error',() => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity',() => {
                    activity.date = activity.date.split('.')[0];
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (err) {
                runInAction('getting activity error',() => {
                    this.loadingInitial = false;
                })
                console.log(err);
            }
        }
    }
    getActivity = (id: string) => this.activityRegistry.get(id);

    @action clearActivity = () => {
        this.activity = null;
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity)
            runInAction('updating activity',() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.editMode = false;
                this.submitting = false;
              })
        } catch (error) {
            runInAction('updating activity error',() => {
                this.submitting = false;
            });
            console.log(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity',() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            });
        } catch (err) {
            console.log(err);
            runInAction('deleting activity error',() => {
                this.submitting = false;
                this.target = '';
            });
        }
    }

    @action setSelectedActivity = (activity: IActivity | null) => {
        if (activity !== null)
            this.activity = activity;
    }

    @action cancelSelectedActivity = () => {
        this.activity = null;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction(() => {
                this.editMode = false;
                this.submitting = false;
            });
        }
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.activity = null;
    }

    @action openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action selectActivity = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = false;
    }
}

export default createContext(new ActivityStore());