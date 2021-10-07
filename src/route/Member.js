import { useState } from "react";

const Member = ({member, saveData, delMember}) => {
    const [name ,setName] = useState(member.name);
    const [message ,setMessage] = useState(member.message);
    const [isEdit, setIsEdit] = useState(false);

    const changeEditMode = (event) => {
        setIsEdit(!isEdit);
    };

    const onChange = (event) => {
        event.preventDefault();

        //let _name = event.target.name;
        let _value = event.target.value;

        if (event.target.name === "name") {
            setName(_value);
        } else if (event.target.name === 'message'){
            setMessage(_value);
        }
    };

    const delClick = (event) =>{
        event.preventDefault();
        delMember(member._id);
    }
    

    return (
        <tr>
            <td>{member.no}</td>
            {isEdit ? (
                 <>
                    <td> <input type="text" name="name" value={name} onChange={onChange} /></td>
                    <td><input type="text" name="message"  value={message} onChange={onChange}/></td>
                    <td><input type="button" value="저장" 
                        onClick={(event)=>{
                            saveData(member._id, name, message);
                            setIsEdit(false);
                        }} />
                    </td>
                    <td><input type="button" value="취소" onClick={changeEditMode} /></td>
                </>
            ) : (
                <>
                <td>{member.name}</td>
                <td>{member.message}</td>
                <td>
                    <input type="button" value="수정" onClick={changeEditMode}></input>
                </td>
                </>
            )}
            <td><input type="button" value="삭제" onClick={delClick}/></td>
        </tr>
    );
};

export default Member;