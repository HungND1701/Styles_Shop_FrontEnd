import React, { useState, useEffect, useContext } from 'react'
import './ReviewAdmin.scss'
import { Input, Table, Tag, Tooltip, Button, Upload, Form, Image, Rate} from 'antd';
import { CiSearch } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { FaRegCommentDots } from "react-icons/fa6";
import { EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import Popup from '../../../Components/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../Components/Admin/Loading/Loading'; 
import Error from '../../../Components/Admin/Error/Error';
import { Context } from '../../../utils/context';
import { deleteReviewFromAdmin, getAllReview } from '../../../services/review';
import { createReply } from '../../../services/reply';
const { TextArea } = Input;

const ReviewAdmin = () => {
  const navigate = useNavigate(); 
  const {setIsClickAdd, setNotifyContent} = useContext(Context);
  const [isOpenPopupDetail, setIsOpenPopupDetail] = useState(false);
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [reviewIdSelectedDelete, setReviewIdSelectedDelete] = useState(null);const [reviewSelectedDetail, setReviewSelectedDetail] = useState(null);
  const [listPickedOrder, setListPickedReview] = useState([]);
  const [replyReviewId, setReplyReviewId] = useState(null);
  const [isOpenPopupReply, setIsOpenPopupReply] = useState(false);


  useEffect(() => {
    getAllReview()
      .then(data => {
          console.log(data);
          setReviews(data);
          setLoading(false);
      })
      .catch(error => {
          setError(error);
          setLoading(false);
      });
  }, []);

  if (loading) {
      return <Loading/>;
  }
  if (error) {
      return <Error/>;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '5%',
    },
    {
      title: 'UserID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: '15%',
      sorter: (a, b) => {
        return new Date(a.time.split(' ')[1].split('-').reverse().join('-') + ' ' + a.time.split(' ')[0]) - 
               new Date(b.time.split(' ')[1].split('-').reverse().join('-') + ' ' + b.time.split(' ')[0]);
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'ProductID',
      dataIndex: 'product_id',
      key: 'product_id',
      width: '5%',
      align: 'center',
      render: (_, record) => {
        return (
            <a onClick={
              ()=>navigate(`/admin/product/${record.product_id}`)
            }>{record.product_id}</a>
        )
      }
    },
    {
      title: 'OrderID',
      dataIndex: 'order_id',
      key: 'order_id',
      width: '5%',
      align: 'center',
      render: (_, record) => {
        return (
            <a onClick={
              ()=>navigate(`/admin/order/${record.order_id}`)
            }>{record.order_id}</a>
        )
      }
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Nhật xét',
      dataIndex: 'review',
      key: 'reivew',
      width: '25%',
      render: (_, record) => {
        return (
            <div> 
              <TextArea disabled={true} value={record.review} autoSize />
            </div>
        )
      }
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        {
            text: 'Đã phản hồi',
            value: 'Đã phản hồi',
        },
        {
            text: 'Chưa phản hồi',
            value: 'Chưa phản hồi',
        },
    ],
    onFilter: (value, record) => record.status === value,
      render: (_, record) =>{
        const color = record.status ==="Đã phản hồi" ? 'geekblue' : 'lime';
        return (
            <Tag color={color} key={record.status}>
                {record.status}
            </Tag>
        )
    }
    },
    {
      title: 'Hành Động',
      align: 'center',
      // width: '15%',
      render: (_, record) => {
          return (
              <div> 
                <div className="actions-column">
                    {
                      record.status==="Chưa phản hồi" &&(
                        <Tooltip title="Phản hồi">
                          <FaRegCommentDots style={{ fontSize: 19 }} 
                          onClick={() => handleReply(record.id)} 
                          />
                      </Tooltip>
                      )
                    }
                    <Tooltip title="Xem">
                        <EyeOutlined style={{ fontSize: 19 }} 
                        onClick={() => handleDetailReview(record.id)} 
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <DeleteOutlined style={{ fontSize: 19 }} 
                        onClick={() => handleDeleteReview(record.id)} 
                        />
                    </Tooltip>
                </div>
              </div>
          )
      }
    },  
  ];

  const handleReply = (id) =>{
    const review = reviews.find(rv=>rv.id===id);
    setReviewSelectedDetail(review);
    setReplyReviewId(id);
    setIsOpenPopupReply(true);
  }

  const handleDeleteReview = (id) =>{
    setReviewIdSelectedDelete(id);
    setIsOpenPopupDelete(true);
  }
  const handleDetailReview= (id) =>{
    const review = reviews.find(rv=>rv.id===id);
    setReviewSelectedDetail(review);
    setIsOpenPopupDetail(true);
  }
  const SubmitDeleteReview = async (id) =>{
    try {
      await deleteReviewFromAdmin(id);
      setReviews(reviews.filter(rv => rv.id !== id));
      setIsOpenPopupDelete(false);
      const notify = {
        type: 'success',
        message: "Xóa thành công review",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể xóa review",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  const SubmitReplyReview = async (values) =>{
    
    try {
      const request = {
        content: values.content,
        review_id: replyReviewId,
      }
      console.log(request);
      const replyResponse = await createReply(request);
      setReviews(prev => prev.map(review => {
        if (review.id === replyReviewId) {
          return {
            ...review,
            status: "Đã phản hồi",
            replies: [...review.replies, replyResponse]
          };
        }
        return review;
      }));
      setIsOpenPopupReply(false);
      const notify = {
        type: 'success',
        message: "Phản hồi thành công",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Phản hồi thành công",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }

  
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setListPickedReview(selectedRows.map(row=>row.id));
    },
  };
  const onClosePopupDelete = ()=>{
    setIsOpenPopupDelete(false);
  }
  const onClosePopupDetail = ()=>{
    setIsOpenPopupDetail(false);
  }
  const onClosePopupReply = ()=>{
    setIsOpenPopupReply(false);
  }
  return (
    <main>
      <div className="container-admin">
        <div className="container-admin__inner">
          <div className="container-admin-header">
            <h4>Review</h4>
          </div>
          <div className="container-admin-actions">
            <div className="search-button">
              <Input size="large" placeholder="Tìm kiếm tên hoặc id " prefix={<CiSearch />} />
            </div>
            <div className='action-buttons'>
              {/* <button className='action-button add-button-primary' 
                onClick={()=>setIsOpenPopupDeleteConfirm(true)}
              >
                <DeleteOutlined/>
                Xóa
              </button> */}
            </div>
          </div>
          <div className="container-table">
            <Table 
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              dataSource={reviews} 
              columns={columns} 
              pagination={{
                pageSize: 8
              }}
            />
          </div>
        </div>
        {
          isOpenPopupDelete &&(
            <Popup onClosePopup={onClosePopupDelete}>
              <div className="popup-header-delete">
                <h2>Xác Nhận Xóa</h2>
                <CgDanger color='red' size='50px'/>
              </div>
              <div className="popup-content">
                <div className="form_container">
                  <div className="form-row-delete">
                    <div className="category">
                      ReviewID : 
                      <span>{reviewIdSelectedDelete}</span>
                    </div>
                  </div>
                  <div className="btn-submit">
                    <Button danger type="primary" onClick={()=>setIsOpenPopupDelete(false)}>Hủy</Button>
                    <Button type="primary" onClick={()=>SubmitDeleteReview(reviewIdSelectedDelete)}>Xác Nhận</Button>
                  </div>
                </div>
              </div>
            </Popup>
          )
        }
        {
          isOpenPopupDetail &&(
            <Popup onClosePopup={onClosePopupDetail}>
              <div className="popup-header-delete">
                <h2>Nhận xét chi tiết</h2>
              </div>
              <div className="popup-content">
                <div className="form_container ">
                    <div className='username'>
                      {reviewSelectedDetail.user.name}
                    </div>
                    <div className="rate">
                        <Rate disabled defaultValue={reviewSelectedDetail.rating}/>
                    </div>
                    <div className="review-images">
                        {
                            reviewSelectedDetail.images.map((img)=>(
                                <Image
                                    height={100}
                                    src={img.url}
                                />
                            ))
                        }
                    </div>      
                    <div className="review-description">
                        <TextArea disabled={true} value={reviewSelectedDetail.review} autoSize/>
                        <span style={{textAlign: 'right'}} className='review-date'>{reviewSelectedDetail.time}</span>
                    </div>
                    {
                      reviewSelectedDetail.status==="Đã phản hồi" && (
                        reviewSelectedDetail.replies.map((reply, index)=>(
                          <div className="review-description" style={{marginLeft: '20px'}}>
                              <i>Hệ thống</i>
                              <TextArea disabled={true} value={reply.content} autoSize/>
                          </div>
                        ))
                      )
                    }
                </div>
              </div>
            </Popup>
          )
        }
        {
          isOpenPopupReply &&(
            <Popup onClosePopup={onClosePopupReply}>
              <div className="popup-header-delete">
                <h2>Phản hồi nhận xét</h2>
              </div>
              <div className="popup-content">
                <div className="form_container ">
                    <div className='username'>
                      {reviewSelectedDetail.user.name}
                    </div>
                    <div className="rate">
                        <Rate disabled defaultValue={reviewSelectedDetail.rating}/>
                    </div>
                    <div className="review-images">
                        {
                            reviewSelectedDetail.images.map((img)=>(
                                <Image
                                    height={100}
                                    src={img.url}
                                />
                            ))
                        }
                    </div>      
                    <div className="review-description">
                        <TextArea disabled={true} value={reviewSelectedDetail.review} autoSize/>
                        <span style={{textAlign: 'right'}} className='review-date'>{reviewSelectedDetail.time}</span>
                    </div> 
                    <Form
                      onFinish={SubmitReplyReview}
                    >
                      <Form.Item label="Phản hồi" name="content" >
                        <TextArea autoSize={{
                            minRows: 4,
                        }}/>
                      </Form.Item>
                      <Button type="primary" htmlType="submit">
                          Phản hồi
                      </Button>
                    </Form>
                </div>
              </div>
            </Popup>
          )
        }
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      </div>
    </main>
  )
}

export default ReviewAdmin