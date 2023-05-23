import React from "react";
import { Link } from "react-router-dom";

export const renderPostContent = (content, hashtags) => {
    const contentParts = content?.split(' ');

    const renderedContent = contentParts?.map((part, index) => {
      if (hashtags?.includes(part.replace(/#/g, ''))) {
        return (
          <Link to={`/search/${part.replace(/#/g, '')}`} style={{color:'rgb(250, 124, 231)'}} key={index}>
             {part}{' '}
          </Link>
        );
      }
      return <React.Fragment key={index}> {part} </React.Fragment>;
    });

    return <p>{renderedContent}</p>;
  };