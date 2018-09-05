import React from 'react';
import ReactDOM from 'react-dom';
import Page from './pages/Page'
import fetch from 'cross-fetch'
import {getCookieValue} from './functions';
import SearchForm from './components/SearchForm'
import LoginForm from './components/LoginForm'
import KeyboardPic from './components/KeyboardPic';
import TypedComponent from './components/TypedComponent';
import IconComponent from './components/IconComponent';
import BreakComponent from './components/BreakComponent';
import GithubResults from './components/GithubResults';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            access_token: null,
            login_url: null,
            user_info: null,
            isLoading: false,
            showResults: null,
            searchTerm: ""
        }
    }

    getUserProfile(token){
        fetch("/oauth/profile?access_token=" + token).then((res) => {
            res.json().then((v) => {
                if(v.location == ""){
                    //we don't have a user location for this dev. 
                    //let's randomly choose out of the following locations
                    const partsUnknown = [
                        "New York, NY",
                        "Los Angeles, CA",
                        "San Francisco, CA",
                        "Chicago, IL",
                        "Toronto, ON"
                    ];
                    v.location = partsUnknown[Math.floor((Math.random() * 4) + 0)]
                }
                this.setState({
                    user_info: v
                })
            })
        })
    }
    componentWillMount(){
        //get the access token from the local storage, if not there
        //show the sign in button
        let access_token = getCookieValue("access_token");

        console.log(access_token);
        if(access_token == null){
            fetch("/oauth/login/url").then((res) => {
                res.json().then((v) => {
                    this.setState({
                        login_url: v.url
                    });
                });
            });
        } else {
            this.getUserProfile(access_token);
            this.setState({
                access_token:access_token
            })
        }
    }

    onSearchError(error){
        console.log(error);
        alert(error)
    }
    onSearchEnd(results){
        console.log(results);
        this.setState({
            isLoading:false,
            showResults: results,
            searchTerm: results.seachTerm
        })
    }

    onSearchBegin(){
        console.log('starting search');
        this.setState({
            isLoading:true,
            showResults: null
        })
    }

    onSearchClear(){
        this.setState({
            isLoading:false
        });
    }

    render(){
        let topSection = null;
        let leftSection = <KeyboardPic/>;
        if (this.state.showResults !== null){
            leftSection = <GithubResults repos={this.state.showResults.repos} 
            user={this.state.showResults.user} token={this.state.access_token} language={this.state.search} />
        }
        if(!this.state.access_token){
            topSection = <LoginForm loginURL={this.state.login_url} />
        }
        if(this.state.user_info){
            topSection = <SearchForm user={this.state.user_info} 
            onSearchBegin={this.onSearchBegin.bind(this)} 
            onSearchEnd={this.onSearchEnd.bind(this)} 
            onSearchError={this.onSearchError.bind(this)}
            onSearchClear={this.onSearchClear.bind(this)}
            token={this.state.access_token} />
        }
        let heroSection = <div><TypedComponent element="h1" hide="false">
            <h1>Connect<br />
            Collab<br />
            Create</h1>
             </TypedComponent>
             <p>Find coders near you to work on projects with! Never work along again.</p>
             </div>;
        let heroSection2 = null;
    
        if (this.state.isLoading){
            heroSection = null;

            heroSection2 = <TypedComponent element="h1" hide="false">
                <h1>Loading...</h1></TypedComponent>;
        }
        return(
            <div>
                <div className="row">
                    {topSection}
                </div>
                <div className="row">
                    <div className="col">
                    {leftSection}
                    </div>
                    <div className="col">
                        <div className="row">
                            {heroSection}
                            {heroSection2}
                        </div>
                    </div>
                </div>
                <div className="row" style={{borderTop:"1px solid black"}}>
                    <IconComponent icon="friends" />
                    <IconComponent icon="github" />
                    <IconComponent icon="code" />
                </div>
            </div>

        );
    }
}


ReactDOM.render(<App />, document.getElementById("app"))
