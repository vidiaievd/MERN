import { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { useHttp } from '../hooks/http.hook';

export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext)
    const [link, setLink] = useState('');
    const { request } = useHttp();
    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('api/link/generate', 'POST', {from: link}, {
                    Authorization: `Bearer ${auth.token}`
                });
                history.push(`/detail/${data.link._id}`)
            } catch (error) {
                
            }
        }
    }

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    return(
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <input
                        placeholder="Link" 
                        id="link" 
                        type="text"
                        name="link"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Link</label>
                </div>
            </div>
        </div>
    )
}