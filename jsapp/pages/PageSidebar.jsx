import React from 'react'

export default class PageSidebar extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="col-4">
            {this.props.children}
            </div>
        )
    }
}