import React, {Component} from "react";
import {GoogleLogout} from "react-google-login";
import {Redirect} from "@reach/router";
import {post, get} from "../../utilities";
import Bookmark from "../modules/Bookmark";
import { Button, Grid, Image } from "semantic-ui-react";
import Group from "../modules/Group";
import NewBookmarkForm from "../modules/NewBookmarkForm";
import NewComponentModal from "../modules/NewComponentModal";
import EditBar from "../modules/EditBar";
import "./Home.css";
import CollapsedGroup from "../modules/CollapsedGroup";
const screenWidth = 6;
class Home extends Component {
    constructor(props) {
        super(props);
        // Initialize Default State
        this.state = {
            groups: [],
            bookmarks: [],
            inEditMode: false,
        };
    }

    componentDidMount() {
        // remember -- api calls go here!
        get("/api/title/bookmarks").then((bookmarks) => {
            let reversedBookmarks = bookmarks.reverse();
            reversedBookmarks.map((bookmark) => {
                this.setState({bookmarks: this.state.bookmarks.concat([bookmark])});
            });
        });
    }

    handleSubmit = ({ url, bookmarkName, icon }) => {
        console.log(this.state.bookmarks);

      const maxIndex = Math.max(0,...this.state.bookmarks.map( e=> e.index ? e.index: 0),
        ...this.state.groups.map(e=> e.index ? e.index : 0));

      const newRow = Math.floor(maxIndex/screenWidth)+1;
      const newCol = maxIndex%screenWidth +1;
      console.log("newRow" + newRow + "finalCol: " + newCol);
        const bookmark = {
            name: bookmarkName,
            url: url,
            image: icon,
            group: null,
            customRow: newRow,
            customCol: newCol,
            index: maxIndex +1
        }

        console.log("sending to api");
        post("/api/title/edit/add_bookmark", bookmark)
            .then((bookmark) => {
                console.log(bookmark.image);
                this.state.bookmarks.push(bookmark);
                this.setState({...this.state, bookmarks: this.state.bookmarks});
            });
    };

    handleSubmitGroup = () => {
      const maxIndex = Math.max(0,...this.state.bookmarks.map( e=> e.index ? e.index: 0),
        ...this.state.groups.map(e=> e.index ? e.index : 0));

      const newRow = Math.floor(maxIndex/screenWidth)+1;
      const newCol = maxIndex%screenWidth +1;
      console.log("newRow" + newRow + "finalCol: " + newCol);
      const group = {
        userId: String,
        name: String,
        bookmarks: [String],
        customRow: newRow,
        customCol: newCol,
        index: maxIndex +1
      }

      console.log("sending group to api")
      post("/api/title/edit/add_group", group)
        .then((group)  =>{
          this.state.groups.push(group);
          this.setState(({...this.state,groups: this.state.groups}));
        });
}
    // filteredBookmarks = this.state.bookmarks.filter((bookmark) =>{
    //   return bookmark.group
    // })
    render() {

        return (
            <div className="Home-root">
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


                <button
                    type="submit"
                    value="Submit"
                    onClick={this.handleSubmit}
                >
                    Add bookmark
                </button>
              <button
                type="submit"
                value="Submit"
                onClick={this.handleSubmitGroup}
              >
                Add Group
              </button>
              <EditBar handleSubmit={this.handleSubmit}/>
                {/*<div className="Home-grid" style={{gridTemplateAreas: "'. . . .' '. . . .' '. . . .' '. . . .'"}}>*/}
                  <div className="Home-grid" >

                  {/*<div className={"content"}>*/}
                  <div className="Home-group" style ={{gridRow: `${2}/${2+1}`,
                    gridColumn: `${3}/${3+1}`}}>
                    <Group
                      bookmarks={this.state.bookmarks}
                      inEditMode =  {this.state.inEditMode}
                      userId = {this.props.userId}
                    />
                  </div>
                  {/*Hard coded Group*/}
                    {/*<div className={"group"}>*/}
                  {/*  <Group*/}
                  {/*    bookmarks={this.state.bookmarks}*/}
                  {/*    inEditMode =  {this.state.inEditMode}*/}
                  {/*    userId = {this.props.userId}*/}
                  {/*  />*/}
                  {/*</div>*/}
                  {/*Group Mapping*/}
                    {this.state.groups.map((group) => {
                      return <div style ={{gridRow: `${group.customRow}/${group.customRow+1}`,
                        gridColumn: `${group.customCol}/${group.customCol+1}`}}>
                        <CollapsedGroup
                          userId={this.props.userId}
                          inEditMode={this.state.inEditMode}
                          name={group.name}
                          location={undefined}
                        /> </div>
                    })}
                    {this.state.bookmarks.map((bookmark) => {
                      return <div style ={{gridRow: `${bookmark.customRow}/${bookmark.customRow+1}`,
                        gridColumn: `${bookmark.customCol}/${bookmark.customCol+1}`}}>
                        <Bookmark
                        userId={this.props.userId}
                        inEditMode={this.state.inEditMode}
                        url={bookmark.url}
                        name={bookmark.name}
                        location={undefined}
                        image={bookmark.image}
                      /> </div>
                    })}
                  {/*</div>*/}
                </div>
                <div>
                    {JSON.stringify(this.state.bookmarks)}
                </div>
                <NewComponentModal
                    trigger={<Button>Create Bookmark</Button>}
                    form={<NewBookmarkForm onSubmit={this.handleSubmit}/>}
                />
            </div>
        );
    }
}

export default Home;