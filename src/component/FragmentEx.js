import { Component } from "react";

class FragmentEx extends Component {

    render(){
        return (
            <React.Fragment>
                <h1>FragmentEx</h1>
                <p>최상위 부모대신 사용가능</p>
            </React.Fragment>
        )
    
    }
}
export default FragmentEx;