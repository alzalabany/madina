import {createSelector} from 'reselect';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import Api from '../api';

const Blog = {};


Blog.isold = () =>(dispatch,getState) => {
  const {oldBlog, blog} = getState();
  dispatch({type:'IVF/MARK/BLOG/',payload:Object.keys(blog).filter(id=>oldBlog[id]===undefined).reduce((all,item)=>(all[item]=true,all),{})})
}
//news actions
Blog.getBlog = () => (dispatch,getState) => Api.get('blog').then(r=>{
        if(!r.ok)return;
        dispatch({type:'IVF/SET/BLOG/',payload:r.data})
      });

Blog.postBlog = (data) => {
  return (dispatch,getState) => {
    const state = getState();
    const user = state.users[state.user_id];
    if(!user || !user.role || user.role !== 'admin')return console.debug('not allowed to post',user);
    console.debug('posting',data);
    return Api.post('blog',data)
      .then(r=>{
        console.log('system post',r)
        if(!r.ok || !r.data || !r.data.id)return;
        const post = r.data;
        dispatch({type:'IVF/UPDATE/BLOG/',payload:{[post.id]:post} })
      });
  }
}
Blog.deletePost = (id) => {
  return (dispatch,getState) => {
    const state = getState();
    const user = state.users[state.user_id];
    if(!user || !user.role || user.role !== 'admin')return console.debug('not allowed to post',user);
    console.debug('deleting'+id);
    return Api.delete('blog/'+id)
      .then(r=>{
        dispatch({type:'IVF/DELETE/BLOG/',id})
      });
  }
}


Blog.initial = {
  blog:{},
  oldBlog:{},
}

Blog.canHandle = action => action.type.indexOf('/BLOG/')>-1

Blog.selectBlog = state => state.blog;

// Blog.selectHistory = createSelector(Blog.selectRoute , nav=>nav.history||[]);

Blog.reducer = (state, action) => {

  if(action.type === 'IVF/MARK/BLOG/'){
      return merge({},state,{oldBlog:action.payload})
  }
  if(action.type === 'IVF/UPDATE/BLOG/'){
    return merge({},state,{blog:action.payload})
  }
  if(action.type === "IVF/SET/BLOG/"){
    return merge({},state, { blog: Object.assign({},state.blog,action.payload) })
  }

  if(action.type === "IVF/DELETE/BLOG/"){
    console.log('deleteing blog',action.id, Object.keys(state.blog));
    const blog = omit(state.blog,action.id)
    console.log('deleteing blog',action.id, Object.keys(blog));
    return Object.assign({},state, {blog});
  }

  return state;
}


export default Blog;