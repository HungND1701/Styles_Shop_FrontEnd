import React, { useState, useEffect, useContext } from 'react'
import './Product.scss'
import Popup from '../../../Components/Popup/Popup';
import Loading from '../../../Components/Admin/Loading/Loading'; 
import Error from '../../../Components/Admin/Error/Error';
import { Context } from '../../../utils/context';
import { useNavigate } from 'react-router-dom';
import {getProducts, deleteProduct} from '../../../services/product';
import { Input, Table, Tag, Tooltip, Button} from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { IoAddOutline } from "react-icons/io5";

const Product = () => {
    const navigate = useNavigate(); 
    const {setIsClickAdd, setNotifyContent} = useContext(Context);
    const [products, setProducts] = useState([]);
    const [productSource, setProductSource] = useState([]);
    const [isOpenPopupAdd, setIsOpenPopupAdd] = useState(false);
    const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
    const [isOpenPopupEdit, setIsOpenPopupEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [productSelected, setProductSelected] = useState(null);
    const [searchValue, setSearchValue] = useState('');
        
    useEffect(() => {
        getProducts()
            .then(data => {
                console.log(data);
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);
    useEffect(()=>{
        const filteredProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchValue.toLowerCase()) || 
            product.id.toString().includes(searchValue)
        )
        .map((product, index) => {
            const categoriesName = product.categories.map(cate => cate.name);
            return {
            key: index + 1,
            id: product.id,
            name: product.name,
            img_url: product.color_product[0].images[0].url,
            price: product.price,
            sale: product.sale,
            tag: product.tag.name,
            type: product.type.name,
            categories: categoriesName, // Convert array to string
            total_quantity: product.total_quantity,
            total_orders: product.total_orders,
            total_quantity_sold: product.total_quantity_sold,
            };
        });
      setProductSource(filteredProducts);
    }, [products, searchValue]);

    if (loading) {
        return <Loading/>;
    }
    if (error) {
        return <Error/>;
    }
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };
    const handleCreateProduct = () =>{
        navigate(`/admin/product/create`);
    }
    const handleEditProduct=(id) =>{
        navigate(`/admin/product/edit/${id}`);
    }
    const handleDetailProduct=(id) =>{
        navigate(`/admin/product/${id}`);
    }
    const handleDeleteProduct=(id) =>{
        const product = products.find(product=>product.id === id);
        setProductSelected(product);
        setIsOpenPopupDelete(true);
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

    const SubmitDeleteProduct = async (id) => {
        try {
          await deleteProduct(id);
          setProducts(products.filter(prd => prd.id !== id));
          setProductSource(productSource.filter(data => data.id !== id ));
          setIsOpenPopupDelete(false);
          const notify = {
            type: 'success',
            message: "Xóa thành công sản phẩm",
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
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: '5%',
          align: 'center',
        },
        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Ảnh',
          dataIndex: 'img_url',
          key: 'img_url',
          width: '10%',
          align: 'center',
          render: (_, record) => {
            return (
              record.img_url && <img src={record.img_url}/>
            );
          }
          
        },
        {
          title: 'Giá',
          dataIndex: 'price',
          key: 'price',
          align: 'center',
        },
        {
          title: 'Giảm giá',
          dataIndex: 'sale',
          key: 'sale',
          align: 'center',
          width: '5%',
        },
        {
            title: 'Phân loại',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: '10%',
        },
        {
            title: 'Danh mục',
            dataIndex: 'categories',
            key: 'categories',
            align: 'center',
            width: '10%',
            render: (_, record) =>{
                return (
                    <>
                        {record.categories.map((tag, index) => {
                            let color = ['geekblue', 'green', 'volcano'][index%3];
                            return (
                            <Tag color={color} key={tag}>
                                {tag}
                            </Tag>
                            );
                        })}
                    </>
                )
            }
        },
        {
            title: 'Tồn kho',
            dataIndex: 'total_quantity',
            key: 'total_quantity',
            align: 'center',
        },
        {
            title: 'Đơn hàng',
            dataIndex: 'total_orders',
            key: 'total_orders',
            align: 'center',
        },
        {
            title: 'Đã bán',
            dataIndex: 'total_quantity_sold',
            key: 'total_quantity_sold',
            align: 'center',
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
    return (
        <main>
            <div className="container-admin">
                <div className="container-admin__inner">
                    <div className="container-admin-header">
                        <h4>Sản phẩm</h4>
                    </div>
                    <div className="container-admin-actions">
                        <div className="search-button">
                            <Input 
                            size="large" 
                            placeholder="Tìm kiếm tên hoặc id" 
                            prefix={<CiSearch />} 
                            value={searchValue}
                            onChange={handleSearchChange}
                            />
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
                                onClick={()=>handleCreateProduct()}
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
                        dataSource={productSource} 
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
                                Tên sản phẩm: 
                                <span>{productSelected.name}</span>
                                </div>
                            </div>
                            <div className="btn-submit">
                                <Button danger type="primary" onClick={()=>setIsOpenPopupDelete(false)}>Hủy</Button>
                                <Button type="primary" onClick={()=>SubmitDeleteProduct(productSelected.id)}>Xác Nhận</Button>
                            </div>
                            </div>
                        </div>
                        </Popup>
                    )
                }
            </div>
        </main>
    )
}

export default Product