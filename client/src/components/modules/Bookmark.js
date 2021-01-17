import React, {useRef, useEffect} from "react";
import "./Bookmark.css";
import "../../utilities.css";
import { Button } from 'semantic-ui-react';


const FAVICON_URL="https://www.google.com/s2/favicons?sz=256&domain_url=";

const Bookmark = ({ 
    userId, 
    inEditMode, 
    url,
    name,
    location,
    }) => {

    useEffect(() => {
        watchBookmark();
    }, [inEditMode]); 

    // Draws a board to the canvas
    const watchBookmark = () => {
       
    }

    return (
            <form action={url} target="_blank">
                <button className="Bookmark-button u-flex-alignCenter" type="submit" >
                    <img className="Bookmark-image u-flex-alignCenter " src={FAVICON_URL + ((url) && url.replace('https://www.',''))}/>
                    <div className="Bookmark-text-container u-flex-alignCenter">
                        <p className="Bookmark-text u-flex-alignCenter u-bold">{name}</p>
                    </div>
                </button>
            </form>   

    );
}

export default Bookmark;
