import React from "react";
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import { ThumbDown, ThumbUp } from "@material-ui/icons";
import { updateEpisodeLike, addEpisodeLike } from "../store";
import { useSelector, useDispatch } from "react-redux";

const EpisodeLikes = (props) => {

  const { episodeLikes } = useSelector(state => state);
  const dispatch = useDispatch();
  
  const { episode, user} = props;

  //--------------------like/dislike calculations--------------------//
  
  // func: sum up episodeLikes to be rendered
  const episodeLikesTotal = (dbFieldNum) => {
      return episodeLikes.reduce((acc, elem) => {
        if(elem.episodeId === episode.id) {
          acc += elem[dbFieldNum];
        }
        return acc;
      }, 0);
  };

  // func: find episodeLike record via redux store using both userId & episodeId from redux store
  const isEpisodeLikeRecord = () => {
    return episodeLikes.find((record) => {
      if (record.userId === user.id && record.episodeId === episode.id)
      return record;
    });
  };
  //func: what goes in button onClick for like/dislike
  // if no record, set thumbsUp/Down status (0 or 1) & create record with add thunk including:
  // if record exists, set thumbsUp/Down status (0 or 1) & update record with update thunk including:
  const onClickDispatchLikes = (userId, episodeId, thumbObj) => {
    if (!isEpisodeLikeRecord()) {
      return addEpisodeLike(userId, episodeId, thumbObj);
    } else {
      return updateEpisodeLike(isEpisodeLikeRecord().id, thumbObj);
    };

  };
  
  //func: evaluate if like exists, eval if opposing like/dislike has value, calculate increment/decrement, then use in thunk
  const adjustThumb = (thumbTypeStr) => {
    const episodeLike = isEpisodeLikeRecord(), result = {};
    if(!episodeLike) return {[thumbTypeStr]: 1};
    if (episodeLike['thumbsUp'] === episodeLike['thumbsDown']) {
      result[thumbTypeStr] = 1;
    } else if (episodeLike['thumbsUp'] === 1 || episodeLike['thumbsDown'] === 1) {
      result[thumbTypeStr] = 0;
    };
    return result;
  };

  //--------------------button logic for likes/dislikes--------------------//
  
    // button click icon swap testing
  const btnElem = document.getElementsByClassName("likeicon");


  return (

    <div>
      <span className="pe-3">0.0K views</span>
      <button 
        type="button" 
        className="bg-transparent border-0" 
        onClick={()=>{ dispatch(onClickDispatchLikes(user.id, episode.id, adjustThumb('thumbsUp'))) }}
      >
        { // filled in thumbUp icon evaluation
          (isEpisodeLikeRecord()?.thumbsUp === 1) ?
          <ThumbUp className="likeicon" style={{color: 'white'}} fontSize='medium'/> 
          :
          <ThumbUpOutlinedIcon className="likeicon" style={{color: 'white'}} fontSize='medium'/>  
        }
      </button>
      <span className="episodeLike-action pe-3" style={{color: 'white', fontSize: '1rem', paddingLeft: '5px'}}>{episodeLikesTotal('thumbsUp')}</span>
      <button 
        type="button" 
        className="bg-transparent border-0" 
        onClick={()=>{ dispatch(onClickDispatchLikes(user.id, episode.id, adjustThumb('thumbsDown'))) }}
      >
        { // filled in thumbDown icon evaluation
          (isEpisodeLikeRecord()?.thumbsDown === 1) ?
          <ThumbDown className="likeicon" style={{color: 'white'}} fontSize='medium'/> 
          :
          <ThumbDownOutlinedIcon className="likeicon" style={{color: 'white'}} fontSize='medium'/>  
        }
      </button>
      <span className="episodeLike-action pe-3" style={{color: 'white', fontSize: '1rem', paddingLeft: '5px'}}>{episodeLikesTotal('thumbsDown')}</span>
    </div>

  );

};

export default EpisodeLikes;