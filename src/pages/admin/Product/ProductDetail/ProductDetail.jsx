import React, {useContext, useState, useEffect} from 'react'
import './ProductDetail.scss'
import Loading from '../../../../Components/Admin/Loading/Loading';
import Error from '../../../../Components/Admin/Error/Error';
import Popup from '../../../../Components/Popup/Popup';
import { getProductById } from '../../../../services/product';
import { useParams } from 'react-router-dom';
import { Input, Image, Col, Row, ColorPicker, Table} from 'antd';
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import {EditOutlined, EyeOutlined, DeleteOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../../utils/context';
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;

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

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data1] = await Promise.all([getProductById(id),]);
                setProduct(data1);
                console.log(data1);
            } catch (error) {
                setProduct(null)
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [id]);

    if (loading) {
        return <Loading/>;
    }
    if (error) {
        return <Error/>;
    }
    
  return (
    <main>
        <div className="container-admin">
            <div className="container-admin__inner">
                <div className="container-admin-header">
                    <h4>Sản phẩm: {product.id}</h4>
                </div>
                <div className="container-admin-info">
                    <div className="product-name">
                        Tên sản phẩm:   <span>{product.name}</span>
                    </div>
                    <div className="product-name">
                        Phân loại:   <span>{product.type.name}</span>
                    </div>
                    <div className="product-price">
                        Giá niêm yết:   <span>{product.price}</span>
                    </div>
                    <div className="product-sale">
                        Giảm giá:   <span>{product.sale}</span>
                    </div>
                    <div className="product-name">
                        Tag:   <span>{product.tag.name}</span>
                    </div>
                    <div className="product-description">
                        <div>
                            Mô tả   
                        </div>
                        <TextArea
                            value={product.description}
                            autoSize
                            disabled={true}
                            style={{backgroundColor: "#fff", padding: "10px 20px", color: "#000"}}
                        />
                    </div>
                </div>
                <div className="container-admin-header">
                    <h4>Màu sắc</h4>
                </div>
                {
                    product.color_product.map((color_product, indexColor)=> (
                        <div key={indexColor} className="container-product-color" >
                            <div className="color_id">
                                Tên : <span>{color_product.color.name}</span>
                            </div>
                            <div className="color_code">
                                <div>Mã màu</div>
                                <div><ColorPicker defaultValue={color_product.color.code} showText disabled /></div>
                            </div>
                            <Row gutter={[16, 24]}>
                                {
                                    color_product.images.map((img,indexImg)=>(
                                        <Col className="gutter-row" span={3}>
                                            <Image
                                                src={img.url}
                                            />
                                        </Col>
                                    ))
                                }
                            </Row>
                            <div className="color-sizes">
                                <div>Kích cỡ</div>
                                <Table 
                                    dataSource={color_product.sizes} 
                                    bordered = {true}
                                    className='table_size'
                                >
                                    <Column title="Kích thước" dataIndex="size" key="size" 
                                    align='center'
                                    render={(size) => (
                                        <>
                                          {size.name}
                                        </>
                                      )}
                                    />
                                    <Column title="Số lượng" dataIndex="quantity" key="quantiry" align='center'/>
                                    <ColumnGroup title="Mô tả">
                                        <Column title="Cân nặng" dataIndex="size" 
                                        key="weight"
                                        align='center'
                                        render={(size) => (
                                            <>
                                              {size.weight}
                                            </>
                                          )}   
                                        />
                                        <Column title="Chiều cao" dataIndex="size" 
                                        key="height" 
                                        align='center'
                                        render={(size) => (
                                            <>
                                              {size.height}
                                            </>
                                        )} 
                                        />
                                    </ColumnGroup>
                                </Table>
                            </div>
                        </div>
                    ))
                }
            </div>
            {/* {
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
            } */}
        </div>
    </main>
  )
}

export default ProductDetail