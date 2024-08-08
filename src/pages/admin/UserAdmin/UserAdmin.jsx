import React, { useState, useEffect, useContext } from 'react'
import './UserAdmin.scss'
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
import { getUsers } from '../../../services/user';
const { TextArea } = Input;

const UserAdmin = () => {
  const navigate = useNavigate(); 
  const {setIsClickAdd, setNotifyContent} = useContext(Context);
  const [isOpenPopupDetail, setIsOpenPopupDetail] = useState(false);
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [reviewIdSelectedDelete, setReviewIdSelectedDelete] = useState(null);const [reviewSelectedDetail, setReviewSelectedDetail] = useState(null);
  const [listPickedOrder, setListPickedReview] = useState([]);
  const [replyReviewId, setReplyReviewId] = useState(null);
  const [isOpenPopupReply, setIsOpenPopupReply] = useState(false);


  useEffect(() => {
    getUsers()
      .then(data => {
          console.log(data);
          setUsers(data);
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // width: '5%',
      // align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      // width: '5%',
    },
    {
      title: 'Đơn đã đặt',
      dataIndex: 'orders',
      key: 'orders',
      align: 'center',
      // width: '10%',
      sorter: (a, b) => {
        return a.orders.length - b.orders.length;
      },
      sortDirections: ['descend', 'ascend'],
      render: (_, record) => {
        return (
           <div>
             {record.orders.length}
           </div>
        )
      }
    },
    {
      title: 'Đơn hoàn thành',
      dataIndex: 'orders',
      key: 'orders_done',
      // width: '5%',
      align: 'center',
      sorter: (a, b) => {
        const alength = a.orders.length !== 0 ? a.orders.filter(ord=>ord.statuses[0].id === 7).length : 0;
        const blength = b.orders.length !== 0 ? b.orders.filter(ord=>ord.statuses[0].id === 7).length : 0;
        return alength - blength;
      },
      sortDirections: ['descend', 'ascend'],
      render: (_, record) => {
        return (
           <div>
             {record.orders.length !== 0 ? record.orders.filter(ord=>ord.statuses[0].id === 7).length : 0}
           </div>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'type',
      key: 'status',
      // width: '5%',
      align: 'center',
      filters: [
        {
            text: 'Active',
            value: 0,
        },
        {
            text: 'InActive',
            value: -1,
        },
      ],
      onFilter: (value, record) => record.type === value,
      render: (_, record) => {
        const color = record.type === 0 ? 'green' : record.type === -1 ? 'red' : 'geekblue';
        return (
            <Tag color={color} key={record.type}>
                {record.type === 0 ? 'Active' : record.type === -1 ? 'InActive' : ''}
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
                    <Tooltip title="Xem">
                        <EyeOutlined style={{ fontSize: 19 }} 
                        // onClick={() => handleDetailUser(record.id)} 
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <DeleteOutlined style={{ fontSize: 19 }} 
                        // onClick={() => handleDeleteUser(record.id)} 
                        />
                    </Tooltip>
                </div>
              </div>
          )
      }
    },  
  ];


  const handleDeleteReview = (id) =>{
    setReviewIdSelectedDelete(id);
    setIsOpenPopupDelete(true);
  }
  const handleDetailReview= (id) =>{
    const review = users.find(rv=>rv.id===id);
    setReviewSelectedDetail(review);
    setIsOpenPopupDetail(true);
  }
  // const SubmitDeleteReview = async (id) =>{
  //   try {
  //     await deleteReviewFromAdmin(id);
  //     setReviews(users.filter(rv => rv.id !== id));
  //     setIsOpenPopupDelete(false);
  //     const notify = {
  //       type: 'success',
  //       message: "Xóa thành công review",
  //       content: null,
  //     }
  //     setNotifyContent(notify);
  //     setIsClickAdd(true);
  //   } catch (error) {
  //     const notify = {
  //       type: 'fail',
  //       message: "Không thể xóa review",
  //       content: null,
  //     }
  //     setNotifyContent(notify);
  //     setIsClickAdd(true);
  //   }
  // }
  // const SubmitReplyReview = async (values) =>{
    
  //   try {
  //     const request = {
  //       content: values.content,
  //       review_id: replyReviewId,
  //     }
  //     console.log(request);
  //     const replyResponse = await createReply(request);
  //     setReviews(prev => prev.map(review => {
  //       if (review.id === replyReviewId) {
  //         return {
  //           ...review,
  //           status: "Đã phản hồi",
  //           replies: [...review.replies, replyResponse]
  //         };
  //       }
  //       return review;
  //     }));
  //     setIsOpenPopupReply(false);
  //     const notify = {
  //       type: 'success',
  //       message: "Phản hồi thành công",
  //       content: null,
  //     }
  //     setNotifyContent(notify);
  //     setIsClickAdd(true);
  //   } catch (error) {
  //     const notify = {
  //       type: 'fail',
  //       message: "Phản hồi thành công",
  //       content: null,
  //     }
  //     setNotifyContent(notify);
  //     setIsClickAdd(true);
  //   }
  // }

  
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
            <h4>Users</h4>
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
              dataSource={users} 
              columns={columns} 
              pagination={{
                pageSize: 8
              }}
            />
          </div>
        </div>
        {/* {
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
        } */}
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

export default UserAdmin