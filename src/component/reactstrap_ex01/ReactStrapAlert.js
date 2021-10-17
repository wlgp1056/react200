import { Component } from "react";
import { UncontrolledAlert, Alert, Button } from "reactstrap";

class ReactStrapAlert extends Component {
    render() {
        return (
            <>
                <div>Bootstrap css 적용하기</div>
                <Alert color="light">심플 Alert</Alert>
                <UncontrolledAlert>UncontrolledAlert</UncontrolledAlert>
                <Button color="danger">Hello</Button>
            </>
        )

    }
}
export default ReactStrapAlert;