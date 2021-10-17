import $ from "jquery";
import { useEffect, useState } from "react";
import Member from "./Member";

const List = () => {
  const [memberList, setMemberList] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("입력");
  const[attachment, setAttachment] = useState("");
  // 중요: Ajax는 비동기 기술이기 때문에 useEffect()를 사용해야 한다.
  useEffect(() => {
    $.get("http://localhost:5500/list", (data, status) => {
      if (status === "success") {
        setMemberList(data);
      }
    });
  }, []);

  // List콤포넌트에 있는 수정기능
  const saveData = (_id, _name, _message) => {
    let updateData = { _id: _id, name: _name, message: _message };

    $.post("http://localhost:5500/update", updateData, (data, status) => {
      if (status === "success") {
        setMemberList(data);
      }
    });
  };

  const delMember = (_id) => {
    // Ajax를 이용해서 Server의 내용을 지우고
    // 콜백함수에서 갱신 해 준다.
    $.post("http://localhost:5500/delete", { _id: _id }, (data, status) => {
      if (status === "success") {
        setMemberList(data);
      }
    });
  };

  // function onSubmit(event) {
  //   event.preventDefault();
  //   // 서버로 Ajax 통신 - 입력 받은 데이터 전송...
  //   // 4교시 스스로 완성 해 보기
  //   let inputData = { name, message };

  //   $.post("http://localhost:5500/input", inputData, (data, status) => {
  //     if (status === "success") {
  //       setMemberList(data);
  //     }
  //   });}
  
      
  const onSubmit2 = (event) => {
    event.preventDefault();
    //console.log(event.target); <form></form>이 들어온다
    //그냥 폼은 태그 엘리먼트일뿐이기에 FormData 타입으로 변경해야한다. 
    let form = event.target;
    let data = new FormData(form);
    // 파일 전송중에는 submit 비활성화되도록
    $("input[type=submit]").prop("disable",true);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "http://localhost:5500/photo_upload_ajax",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
            
          console.log("SUCCESS : ", data);
          
          try {
            setMemberList(JSON.parse(data));
            //console.log(JSON.parse(data));
          } catch(e) {
            console.log("Error----------------------", e);
          }
          $("input[type=submit]").prop("disabled", false); //중단했던거 활성화
        },
        error: function (e) {
            console.log("ERROR : ", e);
            $("input[type=submit]").prop("disabled", false);

        }

});
    
  };
  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    const {
      target: { files },
    } = event;
    const reader = new FileReader();
    //
    reader.onloadend = (progressEvent) => {
      const {
        currentTarget: { result },
      } = progressEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(files[0]);
  };
  

  function valueChange(event) {
    let value = event.target.value;
    if ("name" === event.target.name) {
      setName(value);
    } else if ("message" === event.target.name) {
      setMessage(value);
    }else if("search" ===event.target.name){
      setSearch(value);
    }
  }

  return (
     <> 
    {/* name이라는 이름으로 search에 저장된 값이 전달 */}
      {/* 검색: <input type="text" value={search} name="search" onChange={valueChange}  />
            <input type="submit" value="저장" onClick={()=>{

            }}/> */}
      <form onSubmit={onSubmit2}>
        성명:{" "}
        <input type="text" value={name} name="name" onChange={valueChange} />
        <br />
        메세지:{" "}
        <input
          type="text"
          value={message}
          name="message"
          onChange={valueChange}
        />
        <br />
        파일 <input type="file" name="photo" onChange={onFileChange}/>
        <input type="submit" value="저장" />
      </form>
      <table border="1px" width="100%">
        <thead>
          {memberList.map((member, idx, arr) => {
            return (
              <Member
                delMember={delMember}
                saveData={saveData}
                key={idx}
                member={member}
              />
            );
          })}
        </thead>
      </table>
    </>
  );
};

export default List;