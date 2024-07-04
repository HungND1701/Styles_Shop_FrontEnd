import React, {useState, useContext, useEffect} from 'react'
import './Homepage.scss'
import { Input, Table, Tag, Tooltip, Button, Upload, Form, Image, Switch, Select} from 'antd';
import { IoAddOutline } from "react-icons/io5";
import {PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import Popup from '../../Popup/Popup';
import { useNavigate } from 'react-router-dom';
import { getBannersHomepage, deleteBannersHomepage, updateBannersHomepage, getBannerHomepageById, createBannersHomepage } from '../../../services/bannerHomepage';
import { getCategories } from '../../../services/categories';
import { getCategoriesHomepage, createCategoryHomepage, getCategoryHomepageById, updateCategoryHomepage, deleteCategoryHomepage } from '../../../services/categoryHomepage';
import { deleteFile } from '../../../services/upload';
import Loading from '../Loading/Loading'; 
import Error from '../Error/Error';
import { Context } from '../../../utils/context';
import Category from '../../Category/Category';
const { TextArea } = Input;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

const getTokenFromLocalStorage = () => {
  return sessionStorage.getItem('token'); 
};

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

const Homepage = () => {
  // const navigate = useNavigate(); 
  const {setIsClickAdd, setNotifyContent} = useContext(Context);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isOpenPopupAddBanner, setIsOpenPopupAddBanner] = useState(false);
  const [isOpenPopupAddCategory, setIsOpenPopupAddCategory] = useState(false);
  const [isOpenPopupDeleteBanner, setIsOpenPopupDeleteBanner] = useState(false);
  const [isOpenPopupDeleteCategory, setIsOpenPopupDeleteCategory] = useState(false);
  const [isOpenPopupEditBanner, setIsOpenPopupEditBanner] = useState(false);
  const [isOpenPopupEditCategory, setIsOpenPopupEditCategory] = useState(false);
  const [categoriesOption, setCategoriesOption] = useState([]);
  const [newBanner, setNewBanner] = useState({
    stt: '',
    url: '',
    is_active: false,
  })
  const [newCategory, setNewCategory] = useState({
    stt: '',
    category_id : null,
  })

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [bannersArr, categoriesArr, allCategories] = await Promise.all([getBannersHomepage(), getCategoriesHomepage(), getCategories()]);
            if (Array.isArray(bannersArr)) {
              setBanners(bannersArr);
            } else {
                setBanners([]);
                console.error('Expected array but got:', bannersArr);
            }
            if (Array.isArray(categoriesArr)) {
              console.log(categoriesArr);
              setCategories(categoriesArr.map((category, index) => ({
                id: category.id,
                stt: category.stt,
                category_id: category.category_id,
                name: category.category.name,
                banner_img_url: category.category.banner_img_url, 
                sub_title: category.category.sub_title,
                product_count: category.category.product_count
              })));
            } else {
                setCategories([]);
                console.error('Expected array but got:', categoriesArr);
            }
            if (Array.isArray(allCategories)) {
              setCategoriesOption(allCategories.map((cate)=>({
                value: cate.id,
                label: cate.name
              })))
            } else {
                setBanners([]);
                console.error('Expected array but got:', allCategories);
            }
        } catch (error) {
            setBanners([]);
            setCategories([]);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  useEffect(()=>{
    console.log(categories);
  }, [categories])

  if (loading) {
    return <Loading/>;
  }
  if (error) {
      return <Error/>;
  }

  const handleEditBanner=()=>{

  }

  const handleDeleteBanner = ()=>{

  }

  const handleDeleteCategoryHomepage=()=>{

  }

  const handleEditCategoryHomepage = ()=>{

  }

  const SubmitAddBanner =  async () =>{
    try {
      const newBannerReturn = await createBannersHomepage(newBanner);
      setBanners(prevBanners => [...prevBanners, newBannerReturn]);
      setIsOpenPopupAddBanner(false);
      const notify = {
        type: 'success',
        message: "Thêm thành công banner",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    } catch (error) {
      const notify = {
        type: 'fail',
        message: "Không thể thêm banner",
        content: null,
      }
      setNotifyContent(notify);
      setIsClickAdd(true);
    }
  }
  const SubmitAddCategory =  async () =>{
    try {
      const category = await createCategoryHomepage(newCategory);
      const newCate = {
        id: category.id,
        stt: category.stt,
        category_id: category.category_id,
        name: category.category.name,
        banner_img_url: category.category.banner_img_url, 
        sub_title: category.category.sub_title,
        product_count: category.category.product_count
      }
      setCategories(prevBanners => [...prevBanners, newCate]);
      setIsOpenPopupAddCategory(false);
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

  const handleChangeAddBanner = (e) => {
    const { name, value } = e.target;
    setNewBanner({
        ...newBanner,
        [name]: value
    });
  };
  const handleChangeAddCategory = (e) => {
    const { name, value } = e.target;
    setNewCategory({
        ...newCategory,
        [name]: value
    });
  };
  const handleChangeSelectCategoryAdd = (value) =>{
      setNewCategory({
        ...newCategory,
        category_id: value
    });
  }
  const handleImgChangeBanner = (file) => {
    setNewBanner({
      ...newBanner,
      url: file.response,
    });
  };
  const onChangeBannerActive = (checked) => {
    setNewBanner({
      ...newBanner,
      is_active: checked,
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  const columnsBanner = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      align: 'center',
    },
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Ảnh',
      dataIndex: 'url',
      key: 'url',
      render: (_, record) => {
        return (
          record.url && <img src={record.url}/>
        );
      }
    },
    {
      title: 'trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      filters: [
        {
            text: 'False',
            value: 0,
        },
        {
            text: 'True',
            value: 1,
        },
      ],
      onFilter: (value, record) => record.is_active === value,
      render: (_, record) => {
        return (
          <div>
            {record.is_active === 0 ?
                <div>
                    <Tag color="#f50">Inactive</Tag>
                </div> :
                <div>
                  <Tag color="#87d068">Active</Tag>
                </div>
            }
          </div>
        );
      }
    },
    {
      title: 'Hành Động',
      align: 'center',
      width: '15%',
      render: (_, record) => {
          return (
              <div>
                  {
                      <div className="actions-column">
                          <Tooltip title="Edit">
                              <EditOutlined style={{ fontSize: 19 }} onClick={() =>  handleEditBanner(record.id) } />
                          </Tooltip>
                          <Tooltip title="Delete">
                              <DeleteOutlined style={{ fontSize: 19 }} onClick={() => handleDeleteBanner(record.id)} />
                          </Tooltip>
                      </div>
                  }
              </div>
          )
      }
    },  
  ];
  
  const columnsCategories = [
    {
      title: 'ID',
      dataIndex: 'category_id',
      key: 'category_id',
      width: '5%',
      align: 'center',
    },
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Banner',
      dataIndex: 'banner_img_url',
      key: 'banner_img_url',
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
      width: '10%',
      align: 'center',
    },
    {
      title: 'số sản phẩm',
      dataIndex: 'product_count',
      key: 'product_count',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Hành Động',
      align: 'center',
      width: '15%',
      render: (_, record) => {
          return (
              <div>
                  {
                      <div className="actions-column">
                          <Tooltip title="Edit">
                              <EditOutlined style={{ fontSize: 19 }} onClick={() =>  handleEditCategoryHomepage(record.id) } />
                          </Tooltip>
                          <Tooltip title="Delete">
                              <DeleteOutlined style={{ fontSize: 19 }} onClick={() => handleDeleteCategoryHomepage(record.id)} />
                          </Tooltip>
                      </div>
                  }
              </div>
          )
      }
    },  
  ];

  const onClosePopupAddBanner = ()=>{
    setIsOpenPopupAddBanner(false);
  }
  const onClosePopupDeleteBanner = ()=>{
    setIsOpenPopupDeleteBanner(false);
  }
  const onClosePopupEditBanner = ()=>{
    setIsOpenPopupEditBanner(false);
  }
  const onClosePopupAddCategory = ()=>{
    setIsOpenPopupAddCategory(false);
  }
  const onClosePopupDeleteCategory = ()=>{
    setIsOpenPopupDeleteCategory(false);
  }
  const onClosePopupEditCategory = ()=>{
    setIsOpenPopupEditCategory(false);
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
  return (
    <main>
      <div className="container-admin">
        <div className="container-admin__inner">
          <div className="container-admin-header">
            <h4>Cài đặt hompage</h4>
          </div>
          <div className="banner-container">
            <div className="container-admin-actions" style={{marginBottom:"20px"}}>
              <h2>Banners</h2>
              <div className='action-buttons'>
                <button className='action-button add-button-primary' 
                  onClick={()=>setIsOpenPopupAddBanner(true)}
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
                dataSource={banners.map((banner, index)=>({
                  key: index+1, 
                  id: banner.id, 
                  stt: banner.stt,
                  url: banner.url,
                  is_active: banner.is_active,
                }))} 
                columns={columnsBanner} 
                pagination={{
                  pageSize: 8
                }}
              />
            </div>
          </div>
          <div className="categories-container">
            <div className="container-admin-actions" style={{marginBottom:"20px"}}>
              <h2>Danh mục</h2>
              <div className='action-buttons'>
                <button className='action-button add-button-primary' 
                  onClick={()=>setIsOpenPopupAddCategory(true)}
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
                dataSource={categories.map((category, index)=>({
                  key: index+1, 
                  id: category.id, 
                  stt: category.stt,
                  category_id: category.category_id,
                  banner_img_url: category.banner_img_url,
                  sub_title: category.sub_title,
                  product_count: category.product_count,
                  name: category.name,
                }))} 
                columns={columnsCategories} 
                pagination={{
                  pageSize: 8
                }}
              />
            </div>
          </div>
        </div>
        {
          isOpenPopupAddBanner &&(
            <Popup onClosePopup={onClosePopupAddBanner}>
              <div className="popup-header">
                <h2>Thêm banner mới</h2>
              </div>
              <div className="popup-content">
                <div className="form_container">
                  <Form {...formItemLayout} onFinish={SubmitAddBanner}>

                    <Form.Item {...tailFormItemLayout}>
                      <Form.Item label="Số thứ tự" name="stt" rules={[{ required: true, message: 'Vui lòng nhập số thứ tự' }]}>
                            <Input name="stt" value={newBanner.stt} onChange={handleChangeAddBanner} />
                      </Form.Item>
                      <Form.Item label="Ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                            maxCount={1}
                            onPreview={handlePreview}
                            listType="picture-card"
                            action="http://127.0.0.1:8000/api/uploads/store"
                            onRemove={handleRemoveFile}
                            onChange={(file) => handleImgChangeBanner(file.file)}
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
                      <Form.Item label="active" name="is_active" >
                          <Switch defaultChecked onChange={onChangeBannerActive} />;
                      </Form.Item>
                      <Button type="primary" htmlType="submit">
                          Tạo Banner
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Popup>
          )
        }
        {
          isOpenPopupAddCategory &&(
            <Popup onClosePopup={onClosePopupAddCategory}>
              <div className="popup-header">
                <h2>Thêm danh mục mới vào homepage</h2>
              </div>
              <div className="popup-content">
                <div className="form_container">
                  <Form {...formItemLayout} onFinish={SubmitAddCategory}>

                    <Form.Item {...tailFormItemLayout}>
                      <Form.Item label="Số thứ tự" name="stt" rules={[{ required: true, message: 'Vui lòng nhập số thứ tự' }]}>
                            <Input name="stt" value={newCategory.stt} onChange={handleChangeAddCategory} />
                      </Form.Item>
                      <Form.Item label="Danh mục" name="Category" rules={[{ required: true, message: 'Vui lòng chọn một danh mục' }]}>
                        <Select
                          onChange={handleChangeSelectCategoryAdd}
                          options={categoriesOption}
                        />
                      </Form.Item>
                      <Button type="primary" htmlType="submit">
                          Tạo Banner
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

export default Homepage