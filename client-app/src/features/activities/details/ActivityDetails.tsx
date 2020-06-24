import React, { useContext, useEffect } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';

interface IProps extends RouteComponentProps<DetailParams> {
    
}

interface DetailParams {
    id: string
}

const ActivityDetails: React.FC<IProps> = ({ match, history }) => {
    const { activity, loadActivity, loadingInitial, clearActivity } = useContext(ActivityStore);
    
    useEffect(() => {
        loadActivity(match.params.id);
        return () => {
            clearActivity();
        }
    }, [loadActivity, match.params.id, clearActivity])

    if (loadingInitial || !activity)
        return <LoadingComponent content='Loading Activity...' />
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
            <Card.Header>{activity!.title}</Card.Header>
            <Card.Meta>
                <span>{activity!.date}</span>
            </Card.Meta>
            <Card.Description>
                {activity!.description}
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button basic color="blue" content="Edit" as={Link} exact to={`/manage/${activity.id}`} />
                    <Button basic color="grey" content="Cancel" onClick={() => history.push('/activities') } />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default withRouter(observer(ActivityDetails));