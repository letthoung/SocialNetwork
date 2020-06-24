import React, { FormEvent, useContext, useEffect} from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';
import { v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';


interface IProps extends RouteComponentProps<FormParams> {

}

interface FormParams {
    id: string
}

const ActivityForm: React.FC<IProps> = ({ match, history }) => {
    const { createActivity, editActivity, submitting, clearActivity,
        activity, setSelectedActivity, loadActivity } = useContext(ActivityStore);
    const tempActivity = (() => {
        if(activity !== null){
            return activity;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    })();

    useEffect(() => {
        setSelectedActivity(tempActivity);
        if (match.params.id)
            loadActivity(match.params.id);
        return () => {
            clearActivity();
        }
    }, [loadActivity, clearActivity, match.params.id, setSelectedActivity, tempActivity]);
 
    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log("Here");
        const {name, value} = event.currentTarget;
        if (activity) {
            const temp = {...activity, [name]: value};
            setSelectedActivity(temp);
        }
    }

    const handleSubmit = () => {
        if (activity!.id.length === 0){
            if (activity) {
                let newActivity = {...activity, id: uuid()};
                createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
            }
        } else {
            if (activity)
                editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    return (
    <Segment clearing>
        <Form onSubmit={() => handleSubmit()}>
            <Form.Input name="title" placeholder="Title" 
            value={activity!.title} onChange={handleInputChange} />
            <Form.TextArea name="description" rows={2} placeholder="Description" 
            value={activity!.description} onChange={handleInputChange} />
            <Form.Input name="category" placeholder="Category" 
            value={activity!.category} onChange={handleInputChange} />
            <Form.Input name="date" type='datetime-local' placeholder="Date" 
            value={activity!.date} onChange={handleInputChange} />
            <Form.Input name="city" placeholder="City" 
            value={activity!.city} onChange={handleInputChange} />
            <Form.Input name="venue" placeholder="Venue" 
            value={activity!.venue} onChange={handleInputChange} />
            <Button loading={submitting} floated='right' positive type="submit" 
            content="Submit" />
            <Button floated='right' type="button" content="Cancel" 
            onClick={() => history.push('/activities')} />
        </Form>
    </Segment>
    )
}

export default observer(ActivityForm);