import React, { useState, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik'
import { PostCommentVars, CommentVars } from './types';
import { PostVars, CommentVar } from '../main/dashboard/types';
import { AppState } from '../../redux/types';
import { addComment, removeComment, getUser } from '../../redux/actions';
import { SocialText } from '../styles';
const PostComment: React.FC<PostCommentVars> = ({
  post
}) => {

  const dispatch = useDispatch()
  const history = useHistory()

  const userName = useSelector((state: AppState) => state.logUserReducer)
  const postList: PostVars[] = useSelector((state: AppState) => state.postReducer)

  const [showComment, setShowComment] = useState<boolean>(false)

  const initialValues: Omit<CommentVars, "postID" | "usernameComment"> = {
    comment: ''
  }
  const comment = () => setShowComment(true)

  const onSubmit = (values: Omit<CommentVars, "postID" | "usernameComment">, { resetForm }: any) => {
    const commentData = {
      postID: post.id,
      usernameComment: userName,
      comment: values.comment
    }
    dispatch(addComment(commentData))
    resetForm()
  }

  const commentsCount = (post: PostVars) => {
    const comments = postList.filter((val: PostVars) => val.id === post.id)
    if (!comments) return []
    return (
      <>
        {comments.map((val: PostVars) => {
          return (
            <SocialText key={val.id}>{val.comments.length}</SocialText>
          )
        })}
      </>
    )
  }

  const commentList = useMemo(() => {
    const findComment = postList.find((val: PostVars) => val.id === post.id)
    if (!findComment) return []

    return (
      <ul>
        {findComment.comments.map((val: CommentVar, index: any) => {
          const toProfile = (val: CommentVar) => {
            history.push("/profile")
            dispatch(getUser(val.username))
          }

          return (
            <li key={index}>
              <div onClick={() => toProfile(val)}><b>{val.username}</b> {val.comment}</div>
              <button onClick={() => dispatch(removeComment(val))}>Delete</button>
            </li>
          )
        })}
      </ul>
    )
  }, [post.id, postList, dispatch, history])

  const commentImg = require('../../images/comment.svg');

  return (
    <>
      <img src={commentImg} alt="" onClick={comment} />
      {commentsCount(post)}
      {!showComment ? ''
        : <>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}>
            {
              formik => (
                <>
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <input
                        type="text"
                        name="comment"
                        placeholder="Write your comment..."
                        value={formik.values.comment}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.comment && formik.errors.comment ? (
                        <div>{formik.errors.comment}</div>
                      ) : null}
                    </div>
                  </form>
                </>
              )
            }
          </Formik>
          {commentList}
        </>
      }

    </>
  )
}

export default PostComment