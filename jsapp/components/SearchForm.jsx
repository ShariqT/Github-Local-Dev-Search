import React from 'react'
import fetch from 'cross-fetch'

export default class SearchForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchTerm:""
        };

    }

    onSearch(evt){
        evt.preventDefault();
        var self = this;
        if(this.state.searchTerm.length == 0){
            this.props.onSearchError("Need a valid search term!")
            return;
        }
        this.props.onSearchBegin();
        fetch("/oauth/search?location="+ encodeURIComponent(this.props.user.location) + "&access_token=" + this.props.token + "&lang=" + encodeURIComponent(this.state.searchTerm))
            .then((res) => {
                if(res.status == 200){
                    res.json().then((v) => {
                        console.log(v);
                        if(v.user == null){
                            self.props.onSearchError("Could not find any users that work in that language/framework");
                            return;
                        }
                        v.searchTerm = this.state.searchTerm;
                        self.props.onSearchEnd(v);
                    })
                }else{
                    console.log("not 200")
                    //something went wrong with the request
                    self.props.onSearchError("Could not connect to Github API");
                    return;
                }
            }).catch((err) =>{
                //this will only trigger for network errors, not status
                //code reports
                this.props.onSearchError("Network Error: Could not connect to Github API")
            })
    }
    onChange(evt){
        if(evt.target.value == ""){
            this.props.onSearchClear();
        }
        this.setState({
            searchTerm: evt.target.value
        })
    }

    enterSearch(evt){
        console.log(evt)
    }
    render(){
        
        return(
        <div className="col bordered centered signInText">
            Search for devs in {this.props.user.location} who work in
            <form onSubmit={this.onSearch.bind(this)}>
                <input type="text" className="form-control" 
                onChange={this.onChange.bind(this)}
                placeholder="What programming language would you like to work in today?"
                value={this.state.searchTerm} style={{width:"50%", display:"inline"}} />
                <a href="" className="btn btn-primary" onClick={this.onSearch.bind(this)}>Search</a>
            </form>
        </div>
        )
    }
}