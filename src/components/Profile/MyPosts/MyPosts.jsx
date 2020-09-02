import React from 'react';
import s from './MyPosts.module.css';
import Post from './Post/Posts';

const MyPosts = (props) => {

  let postsElements = props.profilePage.posts
    .map(p => <Post message={p.message} likes={p.likesCount} />);


  let newPostElement = React.createRef();

  let onAddPost = () => {
   props.addPost();
  }

  let onPostChange = () => {
    let text = newPostElement.current.value;
    props.updateNewPostText(text);
  }

  return (
    <div className={s.postsBlock}>
      <h3>My posts</h3>
      <div>
        <div>
          <textarea ref={newPostElement} onChange={onPostChange} value={props.newPostText} />
        </div>
        <div>
          <button onClick={onAddPost}>Add post</button>
        </div>

      </div>
      <div className={s.posts}>
        {postsElements}
      </div>
    </div>

  )
}

export default MyPosts;