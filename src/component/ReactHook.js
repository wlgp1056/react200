import { useEffect, useState } from "react";
// 리액트 컴포넌트 : 함수 컴포넌트, 클래스 컴포넌트
/*
함수 컴포넌트에는 라이프사이클을 대신하는 훅이 있다.
useState(), useEffect()가 있다.
*/

const ReactHook = () => {
    const [contents, setContents] = useState("React Hook 예제");
    const [arr, setArr] = useState(["aa", "bb", "cc"]);

    // Hook
    useEffect(()=>{
        console.log("useEffect....");
    },[]); 

    arr.push("korea");
    
    return (
        <div>
            <h2>{contents}</h2>
            {arr.map((txt, i)=>{
                return <h2 key={i}>{txt}</h2>
            })}
        </div>
    );
};

export default ReactHook; 
