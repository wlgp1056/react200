import React, { Component } from "react";

// 콤포넌트에는 클래스 콤포넌트와 함수 콤포넌트가 있다.
// 라이프사이클 메소드들이 존재한다.
// 클래스 콤포넌트
class LifecycleEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tmp_state: props.prop_value,
    };

    console.log("2.constructor() 함수 ...");
  }

  shouldComponentUpdate(props, state) {
    console.log("6.shouldComponentUpdate() 호출 ...", state.tmp_state2);
    return state.tmp_state2;
  }

  componentDidMount() {
    console.log("4. componentDidMount() 호출 ...");
    console.log("5. tmp_state : ", this.state.tmp_state);
    this.setState({ tmp_state2: true });
  }

  static getDerivedStateFromProps(props, state) {
    // 콤포넌트가 새로운 props를 받게 됐을때 state변경
    console.log("4.getDerivedStateFromProps() 호출 ...", props, state);
    return {};
  }

  // 부모 콤포넌트의 스테이트가 변경 된것을 반영 할때 호출 되다.
  componentDidUpdate() {
    // state가 갱신되면 render()가 실행 될때 호출 된다.
    console.log("3. componentDidUpdate() 호출 ...");
  }

  render() {
    console.log("1. reder() 함수 ...");
    return (
      <h2
        onClick={(event) => {
          this.setState({
            count: 1,
          });
        }}
      >
        [클래스 콤포넌트의 생명주기 예제]
      </h2>
    );
  }
}

export default LifecycleEx;