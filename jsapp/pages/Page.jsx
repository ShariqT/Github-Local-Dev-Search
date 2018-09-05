import React from 'react'
import PageSidebar from './PageSidebar'
export default class Page extends React.Component{
    
    render(){
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                    {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}