// import e from "express";
import $ from "jquery";
import { useEffect, useState } from "react";
import Member from "./Member";
import { Table } from "reactstrap";


const List = () => {
    const [memberList, setMemberList] = useState([]);
    const [name ,setName] = useState("");
    const [message ,setMessage] = useState("");
    
    // Ajax는 비동기 기술이기 때문에 useEffect를 사용해야한다!!!
    // 한 번만 실행되는 걸 의미합니다.
    useEffect(() => {
        $.get("http://localhost:5500/list", (data, status)=>{
            //console.log(data, status);
            if(status === "success"){
                setMemberList(data);
            }
        });
    },[]);

    // 수정
    // saveData List컴포넌트에 있는 수정기능
    const saveData = (_id, _name, _message) => {
        let updateData = { _id: _id, name: _name, message: _message };
    
        $.post("http://localhost:5500/update", updateData, (data, status) => {
          if (status === "success") {
            setMemberList(data);
          }
        });
    };

    // 삭제 
    const delMember = (_id) => {
        // Ajax를 이용해서 Server의 내용을 지우고
        // 콜백함수에서 갱신 해 준다.
        $.post("http://localhost:5500/delete", { _id: _id }, (data, status) => {
          if (status === "success") {
            setMemberList(data);
          }
        });
    };


    function onsubmit(event) {
        // 서버로 Ajax 통신 - 입력받은 데이터 전송....
        event.preventDefault(); 
        console.log("onSubmit");
        console.log(name, message);

        let inputdata = {
            name, message
        };
        console.log("inputdata>>>>",inputdata);

        $.post('http://localhost:5500/input', inputdata, (data, status)=>{
            if(status === "success"){
                setMemberList(data);
            }
        });
    };
    
    function valueChange(event) {
        //console.log(event.target.name);
        let value = event.target.value;
        
        if (event.target.name === 'name') {
            setName(value);
        }else if (event.target.name === 'message'){
            setMessage(value);
        }
        console.log(name, message);
    }


    return (
        <>
        <form onSubmit={onsubmit}>
            성명: <input type="text" name="name" value={name} onChange={valueChange}/>
            <br /> 
            메시지:<input type="text" name="message" value={message} onChange={valueChange}/>
            <br />
            <input type="submit" value="저장" />
        </form>
        <Table border="1px" width="100%">
            <thead>
            {memberList.map((member, idx, arr)=>{
                return <Member saveData={saveData} key={idx} member={member} delMember={delMember} />;
            })}
            </thead>
        </Table>
       </>
    );
};

export default List;