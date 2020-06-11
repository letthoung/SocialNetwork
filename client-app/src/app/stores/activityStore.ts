import { observable } from 'mobx';
import { createContext } from 'react';

class ActivityStore {
    @observable title = "Mobx";
}

export default createContext(new ActivityStore());