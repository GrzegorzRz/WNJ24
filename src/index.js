export { handler } from './resolvers';
import api, {route} from '@forge/api';

export async function trigger(event, context) {
    let priority="High";
    if(findTxtInComment(event.comment, "cito")){
        priority="Low"
    }else if(findTxtInComment(event.comment, "pizza")){
        priority="Highest"
    }else if (findTxtInComment(event.comment, "asap")){
        priority="Lowest"
    }
    const response =await changePriority(event.issue.id, priority);
    console.debug('Response: ', response)
}
async function changePriority(issueIdOrKey, priority){
    const requestUrl =route`/rest/api/3/issue/${issueIdOrKey}`;
    const body ={
        "fields": {
            "priority": {
                "name": priority
            }
        }
    }
    let response = await api.asApp().requestJira(requestUrl, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    return response.json();
}
function findTxtInComment(comment, text){
    const {content}=comment.body;
    const commentTxt= content.find(element=>element.content.find(el=>{
        return el.text?el.text.toLowerCase().includes(text):undefined;
    }))
    console.info('found', commentTxt)
    return !!commentTxt;
}
