import React from "react";
import Message from "./message";
import ScrollToBottom from "react-scroll-to-bottom";
import Media from "react-media";
import { Fragment } from "react";

const Messages = ({messages}) => {

    return (
        <div>
        <Media queries={{
			small: "(max-width: 599px)", // < 600px
			medium: "(min-width: 1024px) and (max-width: 1366px)", // < 1366px
			large: "(min-width: 1400px)" // >= 1400px
		  }}>
          {matches => (
            <Fragment>
                {matches.small &&
                    <Fragment>
                    <div className="px-3">
                    <ScrollToBottom className="h-[calc(84vh-146px)] pb-0 overflow-auto messages-box">
                    <div className="relative"/>
                    {messages?.map((msg) => <Message message={msg} key={Math.random()}/>)}
                    </ScrollToBottom>
                    </div>
                    </Fragment>
                }
                {matches.medium &&
                    <Fragment>
                    <div className="px-3 ">
                    <ScrollToBottom className="h-[calc(84vh-146px)] pb-0 overflow-auto messages-box">
                    <div className="relative"/>
                    {messages?.map((msg) => <Message message={msg} key={Math.random()}/>)}
                    </ScrollToBottom>
                    </div>
                    </Fragment>
                }
                {matches.large &&
                    <Fragment>
                    <div className="px-3">
                    <ScrollToBottom className="h-[calc(84vh-146px)] pb-0 overflow-auto messages-box">
                    <div className="relative"/>
                    {messages?.map((msg) => <Message message={msg} key={Math.random()}/>)}
                    </ScrollToBottom>
                    </div>
                    </Fragment>
                }
            </Fragment>  
          )}

        </Media>
        </div>
        )
};

export default Messages;
