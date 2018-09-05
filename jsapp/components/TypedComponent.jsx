import React from 'react'

export default class TypedComponent extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        var types = new TypeIt(this.props.element, {
            lifeLike:false,
            breakLines:true
          });
    }
    render(){
        if (this.props.hide == "true"){
            return(
                <div className="col" style={{display:"none"}}>
                
            </div> 
            )
        }else{
        return(
            <div className="col">
                {this.props.children}
            </div> 
        )
        }
    }


}