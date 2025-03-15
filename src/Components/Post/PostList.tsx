import React, { useState, useEffect } from "react";
import { Button, Table, Modal, ModalHeader, ModalBody, Popover, PopoverHeader, PopoverBody, Row, Col } from "reactstrap";
import moment from "moment";
import './post.css'
import axios from "axios";
import toast from "react-hot-toast";
import { NodeURL } from "../../api/api";
import Tinymce from "../Dependency/Tinymce/Tinymce";

import imageIcon from "../../images/icons/imageIcon.svg";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchAllPostList } from "../../redux/features/postSlice";
import { AppDispatch } from "../../redux/store";

interface Post {
    _id?: string;
    title: string;
    content: string;
    image: string | File;
    imageUrl?: string;
    createdAt?: string;
  }
  
interface TableOption {
    search: string;
    skip: number;
    limit: number;
    fromDate: string;
    toDate: string;
  }
  
  const PostList: React.FC = () => {
    const [isAddModal, setIsAddModal] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const { list} = useSelector((state:any) => state.post);
    const [deleteId, setDeleteId] = useState<string>("");
    
    const [newPost, setNewPost] = useState<Post>({
      title: "",
      content: "",
      image: "",
    });
  
    const [tableOption, setTableOption] = useState<TableOption>({
      search: "",
      skip: 0,
      limit: 10,
      fromDate: "",
      toDate: "",
    });

    


  
    // const getAllBlogList = async() => {
    //    await  axios.post(`${NodeURL}/get/all/post/list`,tableOption).then((res) => {
    //     if (res.data.status === 1) {
    //       setList(res.data.response.result);
    //     }
    //     if (res && +res.data.status === 0) {
    //         setList(res.data.response.result);
    //       }
    //   });
    // };
  
    useEffect(() => {
        if (tableOption) {
            dispatch(fetchAllPostList(tableOption!)); 
          }
    }, [dispatch,tableOption]);
  
    const openModal = () => setIsAddModal(!isAddModal);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewPost((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/") || file.size > 5242880) {
        toast.error("Maximum Size 5MB or format should be png,jpg,jpeg");
        return;
      }
      const url = URL.createObjectURL(file);
      setNewPost((prev) => ({ ...prev, image: file, imageUrl: url }));
    };
  
    const onSubmitBlog = async() => {
      if (!newPost.title) return toast.error("Title required");
      if (!newPost.content) return toast.error("Content required");
      if (!newPost.image) return toast.error("Image required");
  
      const formData = new FormData();
      Object.entries(newPost).forEach(([key, value]) => formData.append(key, value));
        await axios.post(`${NodeURL}/create/new/post`,formData ).then((res) => {
        if (res.data.status === 1) {
          toast.success("Post created successfully");
          setIsAddModal(false);
          setNewPost({ title: "", content: "", image: "" });
          dispatch(fetchAllPostList(tableOption));
        } else {
          toast.error(res.data.message);
        }
      });
    };
  
    
  const editPost=(data:Post)=>{
    setNewPost(data)
    setIsAddModal(!isAddModal)
  }


  const handleEditPost=async()=>{
    const {title,content,image}=newPost
    if(title===""){
        return toast.error("Title required")
    }
    if(content===""){
        return toast.error("Content required")
    }
    if(image===""){
        return toast.error("image required")
    }

    const formData = new FormData()

    Object.entries(newPost).forEach(([key, value]) => {
        formData.append(key, value);
      });
    await axios.post(`${NodeURL}/edit/post`,formData ).then((res)=>{
        if(res.data.status===1){
            toast.success("Post Updated successfully")
            setIsAddModal(!isAddModal)
            setNewPost({
                title:"",
                content:"",
                image:"",
            })
            dispatch(fetchAllPostList(tableOption));
        }
        if(res.data.status===0){
            toast.error(res.data.message)
        }
    })
  }
  
    const deletePost = async(e: React.MouseEvent, item: Post) => {
      e.stopPropagation();
      console.log(item)
      await axios.post(`${NodeURL}/delete/post`,{  postId: item._id, image: item.image } ).then((res) => {
        console.log(res)
        if (res.data.status === 1) {
          toast.success("Post Deleted successfully");
          setDeleteId("");
          dispatch(fetchAllPostList(tableOption));
        } else {
          toast.error(res.data.message);
        }
      });
    };
  
    return (
      <div className="container my-5">
        <div className="post-head">
          <h3>Post List</h3>
          <Button id="mainPurpleBtn" onClick={openModal}>Add</Button>
        </div>
        <Table className="new-table">
          <thead className="prime-blue">
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Posted Date</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr className="text-center">
                <td colSpan={5}><h6>No records available</h6></td>
              </tr>
            ) : (
              list.map((item:Post, idx:number) => (
                <tr key={idx}>
                  <td>{tableOption.skip + idx + 1}</td>
                  <td>{item?.title}</td>
                  <td>{item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : ""}</td>
                  <td dangerouslySetInnerHTML={{__html:item?.content?.substring(0, 100)}}></td>
                  <td className="action-space">
                    <span className="text-warning" onClick={() => editPost(item)}><i className="fa fa-pencil" aria-hidden="true"></i></span>
                    <span className="text-danger" id={`delete${idx}`} onClick={() => setDeleteId(item._id || "")}><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    <Popover
                            placement="top"
                            isOpen={deleteId === item._id}
                            target={`delete${idx}`}
                            id="delete-pop"
                          >
                            <PopoverHeader>Delete Confirmation</PopoverHeader>
                            <PopoverBody>
                              <h6 className="pb-2 text-muted" style={{ lineHeight: '1.4' }}>
                                Are you sure you want to permanently delete{' '}
                                <b className="text-dark">{item.title}</b>?
                              </h6>
                              <div className="d-flex align-items-center justify-content-between">
                               
                                <button
                                  className='btn btn-sm  btn-outline-warning'
                                  type="button"
                                  title="No"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteId('');
                                  }}
                                >
                                  Cancel
                                </button>
                                <button type="button" className='btn btn-sm btn-outline-danger' title="Yes" onClick={(e) => deletePost(e,item)}>
                                  Delete
                                </button>
                              </div>
                            </PopoverBody>
                          </Popover>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <Modal isOpen={isAddModal} toggle={openModal} size="lg" centered>
        <ModalHeader>{newPost?._id?'Edit':'Add'} Post</ModalHeader>
        <ModalBody>
          <div className="container">
            <Row>
              <Col sm="12" lg="4">
                <label htmlFor="pro-title">Title</label>
                <div className="post-form-box">
                  <input
                    type="text"
                    className="form-control"
                    id="pro-title"
                    name="title"
                    value={newPost.title}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </Col>
              <Col sm="12" lg="12">
                <label htmlFor="pro-title">Content</label>
                <Tinymce
                  content={newPost.content}
                  handleEditorChange={(content) =>
                    setNewPost({ ...newPost, content: content })
                  }
                />
              </Col>
              <Col sm="12" lg="6" md="6">
                <div className="form-box pb-1 mt-2">
                  <label htmlFor="pro-firstName">Upload Photo </label>
                </div>
                <div className="profile-upload">
                  <input
                    type="file"
                    id="profile-upload"
                    onChange={(e) => handleImageUpload(e)}
                  />
                  <label htmlFor="profile-upload" className="prof-upload-label">
                    <img src={imageIcon} alt="Change" />
                    Upload Image
                  </label>
                </div>
              </Col>
              <div className="col-12 mt-3">
                {newPost.imageUrl ? (
                  <img
                    src={`${newPost.imageUrl}`}
                    alt="post image"
                    className="post-img"
                  />
                ) : (
                  newPost?.image !== "" && (
                    <img
                      src={`${NodeURL}/${newPost.image}`}
                      alt="post image"
                      className="post-img"
                    />
                  )
                )}
              </div>
            </Row>
            <div className='mt-4'>
                <button className='btn btn-outline-success' onClick={newPost._id?()=>handleEditPost():()=>onSubmitBlog()}>Submit</button>
              </div>
          </div>
        </ModalBody>
      </Modal>
      </div>
    );
  };
  
  export default PostList;