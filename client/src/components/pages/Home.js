import React, {Component} from "react";
import {GoogleLogout} from "react-google-login";
import {Redirect} from "@reach/router";
import {post, get} from "../../utilities";
import Bookmark from "../modules/Bookmark";
import {Button} from 'semantic-ui-react';
import ModalExampleModal from "../modules/Group";
import NewBookmarkForm from "../modules/NewBookmarkForm";
import NewComponentModal from "../modules/NewComponentModal";

class Home extends Component {
    constructor(props) {
        super(props);
        // Initialize Default State
        this.state = {
            bookmarks: [],
            inEditMode: false,
        };
    }

    componentDidMount() {
        // remember -- api calls go here!
        get("/api/title/links").then((bookmarks) => {
            let reversedBookmarks = bookmarks.reverse();
            reversedBookmarks.map((bookmark) => {
                this.setState({bookmarks: this.state.bookmarks.concat([bookmark])});
            });
        });
    }

    handleSubmit = ({ url, bookmarkName }) => {
        const bookmark = {
            name: bookmarkName,
            url: url,
            image: null,
            group: null
        }

        console.log("sending to api");
        post("/api/title/edit/add_bookmark", bookmark)
            .then((bookmark) => {
                this.state.bookmarks.push(bookmark);
                this.setState({...this.state, bookmarks: this.state.bookmarks});
            });
    };

    render() {
        return (
            <>
                {!this.props.userId && <Redirect to={"/"} noThrow/>}
                <GoogleLogout
                    clientId={this.props.googleClientId}
                    buttonText="Logout"
                    onLogoutSuccess={this.props.handleLogout}
                    onFailure={(err) => console.log(err)}
                />

                <div>
                    yo
                </div>
                <ModalExampleModal bookmarks={this.state.bookmarks}/>
                <button
                    type="submit"
                    value="Submit"
                    onClick={this.handleSubmit}
                >
                    Add bookmark
                </button>
                <div>
                    {this.state.bookmarks.map((bookmark) => {
                        return <Bookmark
                            userId={this.props.userId}
                            inEditMode={this.state.inEditMode}
                            url={bookmark.url}
                            name={bookmark.name}
                            location={undefined}
                        />
                    })}
                </div>
                <div>
                    {JSON.stringify(this.state.bookmarks)}
                </div>
                <NewComponentModal 
                    trigger={<Button>Create Bookmark</Button>} 
                    form={<NewBookmarkForm onSubmit={this.handleSubmit}/>}
                />
            </>
        );
    }
}

export default Home;