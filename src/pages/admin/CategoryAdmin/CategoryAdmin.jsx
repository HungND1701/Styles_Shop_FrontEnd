import React, { useState, useEffect, useContext } from 'react'
import './CategoryAdmin.scss'
import { Input, Table, Tag, Tooltip, Button, Upload, Form, Image} from 'antd';
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { IoAddOutline } from "react-icons/io5";
import {PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import Popup from '../../../Components/Popup/Popup';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../../services/categories';
import { deleteFile } from '../../../services/upload';
import Loading from '../../../Components/Admin/Loading/Loading'; 
import Error from '../../../Components/Admin/Error/Error';
import { Context } from '../../../utils/context';
const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

const handleRemoveFile = async (file)=> {
  const url = file.response;
  const request = {
      url: url,
  };
  try {
      const response = await deleteFile(request);
      console.log(response);
      return true;
  } catch (error) {
      return false;
  }
  
}

const CategoryAdmin = () => {
  const navigate = useNavigate(); 
  const {setIsClickAdd, setNotifyContent} = useContext(Context);
  const [isOpenPopupAdd, setIsOpenPopupAdd] = useState(false);
  const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
  const [isOpenPopupEdit, setIsOpenPopupEdit] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [categorySelected, setCategorySelected] = useState({
    name: '',
    sub_title: '',
    banner_img_url: '',
    description: '',
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    sub_title: '',
    banner_img_url: '',
    description: '',
  })

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setNewCategory({
        ...newCategory,
        [name]: value
    });
  };
  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setCategorySelected({
        ...categorySelected,
        [name]: value
    });
  };
  const handleDeleteCategory = (category_id) =>{
    const category = categories.find(category=>category.id === category_id);
    setCategorySelected(category);
    setIsOpenPopupDelete(true);
  }
  const handleDetailCategory = (category_id) =>{
    navigate(`/admin/category/${category_id}`);
  }
  const handleEditCategory = (category_id) =>{
    const category = categories.find(category=>category.id === category_id);
    console.log(category);
    setCategorySelected(category);
    setIsOpenPopupEdit(true);
  }
  const getTokenFromLocalStorage = () => {
    return sessionStorage.getItem('token'); 
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Tên Danh Mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Banner',
      dataIndex: 'banner_img_url',
      key: 'banner_img_url',
      width: '25%',
      render: (_, record) => {
        return (
          record.banner_img_url && <img src={record.banner_img_url}/>
        );
      }
    },
    {
      title: 'Subtitle',
      dataIndex: 'sub_title',
      key: 'sub_title',
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'product_num',
      key: 'product_num',
      align: 'center',
      width: '15%',
    },
    {
      title: 'Hành Động',
      align: 'center',
      width: '15%',
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
                          <Tooltip title="Edit">
                              <EditOutlined style={{ fontSize: 19 }} onClick={() =>  handleEditCategory(record.id) } />
                          </Tooltip>
                          <Tooltip title="View">
                              <EyeOutlined style={{ fontSize: 19 }} onClick={
                                  () => handleDetailCategory(record.id)} />
                          </Tooltip>
                          <Tooltip title="Delete">
                              <DeleteOutlined style={{ fontSize: 19 }} onClick={() => handleDeleteCategory(record.id)} />
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
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  const onClosePopupAdd = ()=>{
    setIsOpenPopupAdd(false);
  }
  const onClosePopupDelete = ()=>{
    setIsOpenPopupDelete(false);
  }
  const onClosePopupEdit = ()=>{
    setIsOpenPopupEdit(false);
  }
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
};
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleImgChange = (file) => {
      setNewCategory({
        ...newCategory,
        banner_img_url: file.response,
    });
  };
  const handleImgChangeEdit = (file) => {
    setCategorySelected({
      ...categorySelected,
      banner_img_url: file.response,
    });
  };
  const SubmitAddCategory =  async () =>{
    try {
      const newCate = await createCategory(newCategory);
      setCategories(prevCategories => [...prevCategories, newCate]);
      const newData = {
        key: dataSource.length+1, 
        id: newCate.id, 
        name: newCate.name,
        sub_title: newCate.sub_title,
        description: newCate.description,
        banner_img_url: newCate.banner_img_url,
        product_num: 0,
      }
      setDataSource(prevDataSource => [...prevDataSource, newData]);
      setIsOpenPopupAdd(false);
      const notify = {
        type: 'success',
        message: "Thêm thành công danh mục",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể thêm danh mục",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  const SubmitDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
      setDataSource(dataSource.filter(data => data.id !== id ));
      setIsOpenPopupDelete(false);
      const notify = {
        type: 'success',
        message: "Xóa thành công danh mục",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể xóa danh mục",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  const SubmitEditCategory = async (id) => {
    try {
      const categoryUpdate= {
        name: categorySelected.name,
        sub_title: categorySelected.sub_title,
        banner_img_url: categorySelected.banner_img_url,
        description: categorySelected.description,
      }
      const updatedCategory = await updateCategory(id, categoryUpdate);
      setCategories(prevCategories => prevCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
      setDataSource(prevDataSource => prevDataSource.map(data => data.id === updatedCategory.id ? {
        key: data.key,
        id: updatedCategory.id, 
        name: updatedCategory.name,
        sub_title: updatedCategory.sub_title,
        description: updatedCategory.description,
        banner_img_url: updatedCategory.banner_img_url,
        product_num: updatedCategory.products.length,
      } : data));
      setIsOpenPopupEdit(false);
      const notify = {
        type: 'success',
        message: "Sửa thành công danh mục",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể sửa danh mục",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  useEffect(() => {
    getCategories()
      .then(data => {
          setCategories(data);
          setDataSource(data.map((category, index)=>({
            key: index+1, 
            id: category.id, 
            name: category.name,
            sub_title: category.sub_title,
            banner_img_url: category.banner_img_url,
            product_num: category.products.length,
          })))
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
  const formItemLayout = {
    labelCol: {
      span: 6 ,
    },
    wrapperCol: {
      span: 14 ,
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
        span: 24,
        offset: 0,
    },
  };
  return (
    <main>
      <div className="container-admin">
        <div className="container-admin__inner">
          <div className="container-admin-header">
            <h4>Danh mục sản phẩm</h4>
          </div>
          <div className="container-admin-actions">
            <div className="search-button">
              <Input size="large" placeholder="Tìm kiếm tên hoặc id " prefix={<CiSearch />} />
            </div>
            <div className='action-buttons'>
              <button className='action-button'>
                <CiImport />
                Nhập
              </button>
              <button className='action-button'>
                <CiExport />
                Xuất
              </button>
              <button className='action-button add-button-primary' 
                onClick={()=>setIsOpenPopupAdd(true)}
              >
                <IoAddOutline/>
                Thêm
              </button>
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
        {
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
        }
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
                      Tên danh mục: 
                      <span>{categorySelected.name}</span>
                    </div>
                  </div>
                  <div className="btn-submit">
                    <Button danger type="primary" onClick={()=>setIsOpenPopupDelete(false)}>Hủy</Button>
                    <Button type="primary" onClick={()=>SubmitDeleteCategory(categorySelected.id)}>Xác Nhận</Button>
                  </div>
                </div>
              </div>
            </Popup>
          )
        }
        {
          isOpenPopupEdit &&(
            <Popup onClosePopup={onClosePopupEdit}>
              <div className="popup-header">
                <h2>Chỉnh sửa danh mục</h2>
              </div>
              <div className="popup-content">
                <div className="form_container">
                  <Form {...formItemLayout} onFinish={()=>SubmitEditCategory(categorySelected.id)}>

                    <Form.Item {...tailFormItemLayout}>
                      <Form.Item label="Tên danh mục" name="name" >
                            <Input name="name" defaultValue={categorySelected.name} onChange={handleChangeEdit} />
                      </Form.Item>
                      <Form.Item label="Subtitle" name="sub_title" >
                            <Input name="sub_title" defaultValue={categorySelected.sub_title} onChange={handleChangeEdit} />
                      </Form.Item>
                      <Form.Item label="Banner">
                          <Image
                            src={categorySelected.banner_img_url}
                          />
                      </Form.Item>
                      <Form.Item label="Banner thay thế" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                            maxCount={1}
                            onPreview={handlePreview}
                            listType="picture-card"
                            action="http://127.0.0.1:8000/api/uploads/store"
                            onChange={(file) => handleImgChangeEdit(file.file)}
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
                            <TextArea name="description" defaultValue={categorySelected.description} onChange={handleChangeEdit} />
                        </Form.Item>
                      <Button type="primary" htmlType="submit">
                          Sửa danh mục
                      </Button>
                    </Form.Item>
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

export default CategoryAdmin