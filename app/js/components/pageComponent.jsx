import React, {Component} from 'react';
import BreadCrumbComponent from './breadCrumbComponent';
import TabsComponent from './tabs/tabsComponent';

class PageComponent extends Component{
    componentDidMount(){}

    render(){
        return(
            <div className="body-wrapper">
                <TabsComponent />
            </div>
        );
    }
};

export default PageComponent;