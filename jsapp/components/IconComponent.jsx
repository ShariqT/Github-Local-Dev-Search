import React from 'react'


export default class IconComponent extends React.Component{
    constructor(props){
        super(props);
        this.classURL = "fas";
        switch(this.props.icon){
            case "friends":
                this.classURL = this.classURL + " fa-user-friends";
            break;
            case "github":
                this.classURL = "fab fa-github";
            break;
            case "code":
                this.classURL = this.classURL + " fa-code";
            break;
        }

        this.classURL =  this.classURL + " fa-4x";
    }
    render(){
        return(
            <div className="col centered">
                <i className={this.classURL}></i>
            </div>
        )
    }
}