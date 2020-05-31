import React, {useState, FormEvent} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    setEditMode: (editMode: boolean) => void,
    selectedActivity: IActivity
}

export const ActivityForm: React.FC<IProps> = ({setEditMode, selectedActivity}) => {

    const initializeForm = () => {
        if(selectedActivity){
            return selectedActivity;
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
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm());

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value})
    }

    const handleSubmit = () => {
        console.log(activity)
    }

    return (
    <Segment clearing>
        <Form onSubmit={() => handleSubmit()}>
            <Form.Input name="title" placeholder="Title" 
            value={activity.title} onChange={handleInputChange} />
            <Form.TextArea name="description" rows={2} placeholder="Description" 
            value={activity.description} onChange={handleInputChange} />
            <Form.Input name="category" placeholder="Category" 
            value={activity.category} onChange={handleInputChange} />
            <Form.Input name="date" type='date' placeholder="Date" 
            value={activity.date} onChange={handleInputChange} />
            <Form.Input name="city" placeholder="City" 
            value={activity.city} onChange={handleInputChange} />
            <Form.Input name="venue" placeholder="Venue" 
            value={activity.venue} onChange={handleInputChange} />
            <Button floated='right' positive type="submit" 
            content="Submit" />
            <Button floated='right' type="button" content="Cancel" 
            onClick={() => setEditMode(false)} />
        </Form>
    </Segment>
    )
}
