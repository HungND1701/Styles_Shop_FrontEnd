import React, { useState, useEffect, useContext } from 'react'
import './OrderAdmin.scss'
import { Input, Table, Tag, Tooltip, Button, Upload, Form, Image} from 'antd';
import { CiSearch } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { IoAddOutline } from "react-icons/io5";
import { SiTicktick } from "react-icons/si";
import { GrCaretNext } from "react-icons/gr";
import { EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import Popup from '../../../Components/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../Components/Admin/Loading/Loading'; 
import Error from '../../../Components/Admin/Error/Error';
import { Context } from '../../../utils/context';
import { confirmOrder, deleteOrderFromAdmin, getAllOrder, nextStatus } from '../../../services/order';

export const formatNumber = (num) => {
  return num.toLocaleString('de-DE'); // Sử dụng 'de-DE' để có định dạng với dấu chấm
};

const OrderAdmin = () => {
  const navigate = useNavigate(); 
  const {setIsClickAdd, setNotifyContent} = useContext(Context);
  const [isOpenPopupAdd, setIsOpenPopupAdd] = useState(false);
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [isOpenPopupDeleteConfirm, setIsOpenPopupDeleteConfirm] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [orderIdSelectedDelete, setOrderIdSelectedDelete] = useState(null);
  const [listPickedOrder, setListPickedOrder] = useState([]);

  useEffect(() => {
    getAllOrder()
      .then(data => {
          console.log(data);
          setOrders(data);
          setDataSource(data.map((order, index)=>({
            key: index+1, 
            id: order.id, 
            username: order.user.name,
            time: order.time,
            total_price: formatNumber(order.total_price),
            status: order.statuses[0].name,
            payment_menthod: order.payment_method.name,
          })))
          setLoading(false);
      })
      .catch(error => {
          // setError(error);
          setLoading(false);
      });
  }, []);
  useEffect(() => {
    
  }, [dataSource]);

  if (loading) {
      return <Loading/>;
  }
  if (error) {
      return <Error/>;
  }

  const handleDeleteOrder = (order_id) =>{
    setOrderIdSelectedDelete(order_id);
    setIsOpenPopupDelete(true);
  }
  const handleDetailOrder = (order_id) =>{
    navigate(`/admin/order/${order_id}`);
  }
  const handleChangeNextStatus = async (id) => {
    console.log(id);
    try {
      const newOrder = await nextStatus(id);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          id===order.id
            ? newOrder
            : order
        )
      );
      setDataSource(prevData =>
        prevData.map(data =>
          id===data.id
            ? { ...data, status: newOrder.statuses[0].name }
            : data
        )
      );
      const notify = {
        type: 'success',
        message: "Chuyển trạng thái thành công",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể chuyển trạng thái",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  const SubmitDeleteOrder = async (id) =>{
    try {
      await deleteOrderFromAdmin(id);
      setOrders(orders.filter(order => order.id !== id));
      setDataSource(dataSource.filter(data => data.id !== id ));
      setIsOpenPopupDelete(false);
      const notify = {
        type: 'success',
        message: "Xóa thành công đơn hàng",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể xóa đơn hàng",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => {
        return new Date(a.time.split(' ')[1].split('-').reverse().join('-') + ' ' + a.time.split(' ')[0]) - 
               new Date(b.time.split(' ')[1].split('-').reverse().join('-') + ' ' + b.time.split(' ')[0]);
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Người mua',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Giá trị đơn hàng',
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'center',
      // width: '15%',
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'payment_menthod',
      key: 'payment_menthod',
      align: 'center',
      // width: '15%',
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        {
            text: 'Chờ xác nhận',
            value: 'Chờ xác nhận',
        },
        {
            text: 'Đã xác nhận',
            value: 'Đã xác nhận',
        },
        {
            text: 'Chờ lấy hàng',
            value: 'Chờ lấy hàng',
        },
        {
            text: 'Đang giao hàng',
            value: 'Đang giao hàng',
        },
        {
            text: 'Đã giao',
            value: 'Đã giao',
        },
        {
            text: 'Đã Hủy',
            value: 'Đã Hủy',
        },
        {
            text: 'Hoàn thành',
            value: 'Hoàn thành',
        },
        {
          text: 'Thất bại',
          value: 'Thất bại',
        },
        {
          text: 'Đã trả hàng',
          value: 'Đã trả hàng',
        },
        {
          text: 'Đã hoàn tiền',
          value: 'Đã hoàn tiền',
        },
    ],
    onFilter: (value, record) => record.status === value,
      render: (_, record) =>{
        const color = record.status ==="Đã Hủy" ? 'red' : record.status ==="Chờ xác nhận" ? 'geekblue' : record.status ==="Hoàn thành" ? 'green': 'lime';
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
      filters: [
          {
              text: 'False',
              value: 'False',
          },
          {
              text: 'True',
              value: 'True',
          },
      ],
      onFilter: (value, record) => record.is_active === value,
      render: (_, record) => {
          return (
              <div>
                  {record.is_active === 'False' ?
                      <div>
                          <Tag color="#f50">Inactive</Tag>
                      </div> :
                      <div className="actions-column">
                          {
                            (record.status!='Đã Hủy' && record.status!='Chờ xác nhận' &&record.status!='Hoàn thành')&&<Tooltip title="Chuyển trạng thái tiếp">
                                <GrCaretNext style={{ fontSize: 19 }} 
                                onClick={() =>  handleChangeNextStatus(record.id) } 
                                />
                            </Tooltip>

                          }
                          <Tooltip title="Xem">
                              <EyeOutlined style={{ fontSize: 19 }} 
                              onClick={() => handleDetailOrder(record.id)} 
                              />
                          </Tooltip>
                          <Tooltip title="Xóa">
                              <DeleteOutlined style={{ fontSize: 19 }} 
                              onClick={() => handleDeleteOrder(record.id)} 
                              />
                          </Tooltip>
                      </div>
                  }
              </div>
          )
      }
    },  
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setListPickedOrder(selectedRows.map(row=>row.id));
    },
  };
  const onClosePopupDelete = ()=>{
    setIsOpenPopupDelete(false);
  }
  const handleConfirmStatusChange = async () => {
    console.log(listPickedOrder);
    try {
      const request = {
        listOrder : listPickedOrder
      }
      const data = await confirmOrder(request);
      const notify = {
        type: 'success',
        message: "Xác nhận thành công đơn hàng",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
      setTimeout(
        navigate(0),
        1000
      )
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể xác nhận đơn hàng",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  
  return (
    <main>
      <div className="container-admin">
        <div className="container-admin__inner">
          <div className="container-admin-header">
            <h4>Đơn hàng</h4>
          </div>
          <div className="container-admin-actions">
            <div className="search-button">
              <Input size="large" placeholder="Tìm kiếm tên hoặc id " prefix={<CiSearch />} />
            </div>
            <div className='action-buttons'>
              <button className='action-button add-button-primary' 
                onClick={()=>handleConfirmStatusChange()}
              >
                <SiTicktick />
                Xác nhận
              </button>
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
              dataSource={dataSource} 
              columns={columns} 
              pagination={{
                pageSize: 8
              }}
            />
          </div>
        </div>
        {/* {
          isOpenPopupAdd &&(
            <Popup onClosePopup={onClosePopupAdd}>
              <div className="popup-header">
                <h2>Thêm danh mục mới</h2>
              </div>
              <div className="popup-content">
                <div className="form_container">
                  <Form {...formItemLayout} onFinish={SubmitAddCategory}>

                    <Form.Item {...tailFormItemLayout}>
                      <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}>
                            <Input name="name" value={newCategory.name} onChange={handleChangeAdd} />
                      </Form.Item>
                      <Form.Item label="Subtitle" name="sub_title" rules={[{ required: true, message: 'Vui lòng nhập subtitle' }]}>
                            <Input name="sub_title" value={newCategory.sub_title} onChange={handleChangeAdd} />
                      </Form.Item>
                      <Form.Item label="Ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                            maxCount={1}
                            onPreview={handlePreview}
                            listType="picture-card"
                            action="http://127.0.0.1:8000/api/uploads/store"
                            onChange={(file) => handleImgChange(file.file)}
                            onRemove={handleRemoveFile}
                            headers={{
                                Authorization: `Bearer ${getTokenFromLocalStorage()}`, 
                            }}
                        >
                            <button
                                style={{
                                    border: 0,
                                    background: 'none',
                                }}
                                type="button"
                            >
                            <PlusOutlined />
                            <div
                                style={{
                                marginTop: 8,
                                }}
                            >
                                Tải lên
                            </div>
                            </button>
                        </Upload>
                      </Form.Item>
                      <Form.Item label="Mô tả" name="description" >
                            <TextArea name="description" value={newCategory.description} onChange={handleChangeAdd} />
                        </Form.Item>
                      <Button type="primary" htmlType="submit">
                          Tạo danh mục
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Popup>
          )
        } */}
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
                      Mã đơn hàng: 
                      <span>{orderIdSelectedDelete}</span>
                    </div>
                  </div>
                  <div className="btn-submit">
                    <Button danger type="primary" onClick={()=>setIsOpenPopupDelete(false)}>Hủy</Button>
                    <Button type="primary" onClick={()=>SubmitDeleteOrder(orderIdSelectedDelete)}>Xác Nhận</Button>
                  </div>
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

export default OrderAdmin