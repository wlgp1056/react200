import { Component } from "react";
import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle } from "reactstrap";

class ReactStrapCard extends Component {
    render() {
        return (
            <div>
                <Card>
                    <CardImg top height="200px" src="https://mblogthumb-phinf.pstatic.net/MjAxNzA4MjJfMTU2/MDAxNTAzMzU1NTI5MTE5.-SACIi2ccy0t15AZQuV2pzfCqnuE-47heN215DiQGZAg.mrr-auknKfj-38_KGe40VPMPplnAnwiUiIu2eIZBAQUg.JPEG.doghter4our/IMG_0931.jpg?type=w800" />
                    <CardBody>
                        <CardTitle>카드 제목 : 짱구는 못말려</CardTitle>
                        <CardSubtitle>카드 부제목 : 유치원 가는 짱구</CardSubtitle>
                        <CardText>카드 내용 : 귀여운 짱구네..ㅎ</CardText>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
export default ReactStrapCard;