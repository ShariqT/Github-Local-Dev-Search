import React from 'react'

export default class LoginForm extends React.Component{
    render(){
        return(
            <div className="col bordered centered signInText">
                Find developers near you to create something awesome!
                <a href={this.props.loginURL} style={{color:'white'}} className="btn btn-primary">Sign In With Github</a>
            </div> 
        )
    }
}