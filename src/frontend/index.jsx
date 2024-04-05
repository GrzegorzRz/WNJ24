import React, { useEffect, useState } from 'react';
import ForgeReconciler, {Text, useProductContext} from '@forge/react';
import {invoke, requestJira} from '@forge/bridge';

const fetchCommentsForIssue = async (issueIdOrKey) => {
    const res = await requestJira(`/rest/api/3/issue/${issueIdOrKey}/comment`);
    const data = await res.json();
    return data.comments;
};
const countEmojis=(comments)=>{
    let counter=0;
    comments.find(comment=>{
        return comment.body.content.find(docElement=>docElement.content.find(content=>{
            if(content.type==="emoji"){
                counter++;
            }
        }))
    })
    return counter;
}
const App = () => {
    const context=useProductContext();
    const [comments, setComments] = useState(null);
    useEffect(() => {
        if (context){
            const issueId =context.extension.issue.id;
            fetchCommentsForIssue(issueId).then(setComments)
        }
    }, [context]);
    return (
        <>
            <Text>{comments ? `Issue: ${context.extension.issue.id} has ${countEmojis(comments)} emojis` : 'Loading...'}</Text>
        </>
    );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
