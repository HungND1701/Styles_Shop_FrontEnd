import React, {useContext, useState, useEffect} from 'react'
import './CategoryDetail.scss'
import Loading from '../../../../Components/Admin/Loading/Loading';
import Error from '../../../../Components/Admin/Error/Error';
import Popup from '../../../../Components/Popup/Popup';
import { getCategory, addProduct } from '../../../../services/categories';
import { getAllProduct } from '../../../../services/product';
import { useParams } from 'react-router-dom';
import { Input, Table, Tag, Tooltip, Button, Select , Form} from 'antd';
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import {EditOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../../utils/context';

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

const CategoryDetail = () => {
    const navigate = useNavigate(); 
    const {setNotifyContent, setIsClickAdd} = useContext(Context);
    const { id } = useParams();
    const baseSrc = '../../../../Assets';
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productData, setProductData] = useState([]);
    const [productSource, setProductSource] = useState([]);
    const [isOpenPopupAdd, setIsOpenPopupAdd] = useState(false);
    const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
    const [isOpenPopupEdit, setIsOpenPopupEdit] = useState(false);
    const [productIdAdd, setProductIdAdd] = useState(-1);
    const [productOptions, setProductOptions] = useState([]);

    const handleEditProduct= (product_id)=>{

    }
    const handleDetailProduct= (product_id)=>{
        
    }
    const handleDeleteProduct= (product_id)=>{
        
    }
    const onClosePopupAdd = ()=>{
        setIsOpenPopupAdd(false);
    }
    const onClosePopupDelete = ()=>{
        setIsOpenPopupDelete(false);
    }
    const onClosePopupEdit = ()=>{
        setIsOpenPopupEdit(false);
    }
    
    const handleCreateProduct = () =>{
        navigate(`/admin/product/create?category_id=${category.id}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data1, data2] = await Promise.all([getCategory(id), getAllProduct()]);
                if (data1 && Array.isArray(data1.products)) {
                    setCategory(data1);
                    setProductData(data1.products);
                    console.log(data1);
                } else {
                    setCategory({ products: [] });
                    console.error('Expected object with products array but got:', data1);
                }
                if (Array.isArray(data2)) {
                    console.log(data2)
                    setProductOptions(data2.map((data)=>({
                        value: data.id,
                        label: `(${data.id}) ${data.name}`,
                    })));
                } else {
                    setProductOptions([]);
                    console.error('Expected array but got:', data2);
                }
            } catch (error) {
                setCategory({ products: [] });
                setProductOptions([]);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    useEffect(()=>{
        setProductSource(productData.map((product, index) => ({
            key: index+1,
            id : product.id,
            name : product.name,
            image_url : product.img_url,
            total_quantity: product.total_quantity
        })))
      }, [productData]);
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
          width: '10%',
          align: 'center',
        },
        {
          title: 'Ảnh',
          dataIndex: 'image_url',
          key: 'image_url',
          align: 'center',
          width: '10%',
          render: (_, record) => {
            return (
                <img src={record.image_url}/>
            );
          }
        },
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
          key: 'name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'total_quantity',
            key: 'total_quantity',
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
                                  <EditOutlined style={{ fontSize: 19 }} onClick={() =>  handleEditProduct(record.id) } />
                              </Tooltip>
                              <Tooltip title="View">
                                  <EyeOutlined style={{ fontSize: 19 }} onClick={
                                      () => handleDetailProduct(record.id)} />
                              </Tooltip>
                              <Tooltip title="Delete">
                                  <DeleteOutlined style={{ fontSize: 19 }} onClick={() => handleDeleteProduct(record.id)} />
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

    const SubmitAddProduct =  async () =>{
        try {
            if(productIdAdd!==-1){
                const newCate = await addProduct(id, {product_id: productIdAdd});
                if (newCate && Array.isArray(newCate.products)) {
                    setCategory(newCate);
                     setProductData(newCate.products);
                    console.log(newCate);
                } else {
                    setCategory({ products: [] });
                    console.error('Expected object with products array but got:', newCate);
                }
                setIsOpenPopupAdd(false);
                const notify = {
                  type: 'success',
                  message: "Thêm thành công danh mục",
                  content: null,
                }
                setNotifyContent(notify);
                setIsClickAdd(true);
            }
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
  return (
    <main>
        <div className="container-admin">
            <div className="container-admin__inner">
                <div className="container-admin-header">
                    <h4>Danh mục: {category.name}</h4>
                </div>
                <div className="container-admin-info">
                    <div className="category-name">
                        Tên danh mục:   <span>{category.name}</span>
                    </div>
                    <div className="category-description">
                        Mô tả :   <span>{category.description}</span>
                    </div>
                    <div className="category-product_num">
                        Số sản phẩm :   <span>{productData.length}</span>
                    </div>
                    <div className="category-product_num">
                       Banner 
                    </div>
                    <div className="category-product_num">
                       <img src={category.banner_img_url} alt="" />
                    </div>
                </div>
                <div className="container-admin-header">
                    <h4>Sản phẩm</h4>
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
                        <button className='action-button add-button-primary' 
                            onClick={()=>handleCreateProduct()}
                        >
                            <IoAddOutline/>
                            Tạo mới
                        </button>
                    </div>
                </div>
                <div className="container-table">
                    <Table 
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    dataSource={productSource} 
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
                        <h2>Thêm sản phẩm vào danh mục</h2>
                    </div>
                    <div className="popup-content">
                        <div className="form_container">
                        <Form {...formItemLayout} onFinish={SubmitAddProduct}>

                            <Form.Item {...tailFormItemLayout}>
                            <Form.Item label="Sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}>
                                <Select
                                    showSearch
                                    style={{
                                    width: 200,
                                    }}
                                    placeholder="Tìm kiếm sản phẩm"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={productOptions}
                                    onChange={(value)=>setProductIdAdd(value)}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Thêm sản phẩm
                            </Button>
                            </Form.Item>
                        </Form>
                        </div>
                    </div>
                    </Popup>
                )
            }
        </div>
    </main>
  )
}

export default CategoryDetail