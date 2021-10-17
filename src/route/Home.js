//import LifecycleEx from "../component/LifecycleEx";
// import FragmentEx from "../component/FragmentEx";
// import ReactHook from "../component/ReactHook";

import { useState } from "react";
import $ from "jquery";

// import ReactStrapCard from "../component/ReactStrapCard";

//import ReactStrapAlert from "../component/ReactStrapAlert";

const Home = () => {
    const [attachment, setAttachment] = useState("");
    
    const onSubmit = (event) => {
        event.preventDefault();
        console.dir(event);
        console.log(event.target); // <form>...</form>

        let form = event.target;
        
        // 그냥 form은 태그엘리먼트일 뿐이다.
        // FormData 타입으로 변경 해야한다
        let data = new FormData(form);

        // 파일전송중에는 submit버튼이 비활성화
        $("input[type=submit]").prop("disabled", true);

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
                alert("sucess!!!");
                $("input[type=submit]").prop("disabled", false);

            },
            error: function (e) {
                console.log("ERROR : ", e);
                alert("실패!!!");
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
   
    return (
        <>
            <div>Home...</div>
            {/* <LifecycleEx /> */}
            {/* <ReactHook /> */}
            {/* <FragmentEx /> */}
            {/* <ReactStrapAlert /> */}
            {/* <ReactStrapCard /> */}
            <form onSubmit={onSubmit}>
                파일 업로드 : <input type="file" name="photo" onChange={onFileChange} />
                <input type="submit" value="저장하기" />
            </form>
            {attachment && (
                <>
                    <img src={attachment} width="100" />
                    <input type="button" 
                    onClick={()=>{
                        setAttachment("");
                    }}
                    value="Clear" />
                </>
            )}
        </>
    );
};

export default Home;