import React from 'react'
import fetch from 'cross-fetch'
export default class GithubResults extends React.Component{
    constructor(props){
        super(props);
       
    }

    componentWillMount(){
        
    }

    flipCard(){
        console.log("flipped");
        anime({
            targets: ".content",
            rotateY: '180deg',
            duration:100
        })
    }

    flipCardBack(){
        console.log("flipped");
        anime({
            targets: ".content",
            rotateY: '0deg',
            duration:100
        })
    }

    render(){
        var repolist = [];
        repolist = this.props.repos.map((repo, idx) => {
            let repoURL = "https://github.com/" + repo.full_name;
            let repoDescription = "No description given"
            if (repo.description !== "null"){
                repoDescription = repo.description;
            }
            return (
                <li className="list-group-item" key={idx}>
                    <p style={{fontSize:"15px"}}><a href={repoURL} target="_blank">{repo.name}</a></p>
                    {repoDescription}
                </li>
            );
        })
        return(
            <div className="cardContainer">
                <div className="userCard">
                    <div className="content">
                        <div className="front">
                            <img src={this.props.user.avatar_url} className="rounded" width="90%" />
                            <h5>{this.props.user.login}</h5>
                            <button className="btn btn-primary" onClick={this.flipCard.bind(this)}>View Repos</button>

                        </div>
                        <div className="back">
                            <h5>Repos</h5>
                            <ul className="list-group list-group-flush">
                                {repolist}
                            </ul>
                            <p></p>
                            <button className="btn btn-primary" onClick={this.flipCardBack.bind(this)}>View Profile</button>
                        </div>
                    </div>
                </div>
                <div style={{position: "absolute", top:"0px", left:"50%", backgroundColor:'black', padding:"20px"}}>
                    <p style={{color:"white"}}>We have selected a prime candidate for you to potentially collaborate with.</p>
                </div>

            </div>
        )
    }
}