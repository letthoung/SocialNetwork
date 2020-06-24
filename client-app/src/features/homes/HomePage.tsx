import React from 'react';
import { Container } from 'semantic-ui-react';

interface IProps {

}

const HomePage: React.FC<IProps> = () => {
    return (
        <Container styles={{ marginTop: "7em" }}>
            <h1>Home Page</h1>
        </Container>
    )
}

export default HomePage;