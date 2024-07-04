import React, {useContext, useState, useEffect} from 'react'
import './ProductEdit.scss'
import Loading from '../../Loading/Loading';
import Error from '../../Error/Error';
import Popup from '../../../Popup/Popup';
import { getProductById, updateProduct, deleteImageFromProduct } from '../../../../services/product';
import {getColors} from '../../../../services/color';
import {getTags} from '../../../../services/tag';
import {getTypes} from '../../../../services/type';
import {getCategories} from '../../../../services/categories';
import {getSizesByProductTypeId} from '../../../../services/size';
import { useParams } from 'react-router-dom';
import { Input, Image, Space, ColorPicker, Table, Form, Select, Button, Flex, Upload} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../../utils/context';
const { TextArea } = Input;
const { Option } = Select;

const uploadButton = (
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
        Upload
      </div>
    </button>
);

const getTokenFromLocalStorage = () => {
    return sessionStorage.getItem('token'); 
};
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    }
);
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

const ProductEdit = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate(); 
    const {setNotifyContent, setIsClickAdd} = useContext(Context);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unitSale, setUnitSale] = useState('%');
    const [categoriesList, setCategoriesList] = useState([]);
    const [colorsList, setColorsList] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [sizesList, setSizesList] = useState([]);
    const [typesList, setTypesList] = useState([]);
    const [tagsOption, setTagsOption] = useState([]);
    const [typesOption, setTypesOption] = useState([]);
    const [categoriesOption, setCategoriesOption] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [data1, colors, tags, types, categories] = await Promise.all([getProductById(id), getColors(), getTags(), getTypes(), getCategories()]);
                setProduct(data1);
                setColorsList(colors);
                setTagsList(tags);
                setTypesList(types);
                setCategoriesList(categories);
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
    useEffect(()=>{
        setTagsOption(tagsList.map((tag, index) => ({
            value: tag.id,
            label: tag.name,
        })))
    },[tagsList])

    useEffect(()=>{
        setTypesOption(typesList.map((type, index) => ({
            value: type.id,
            label: type.name,
        })))
    },[typesList])

    useEffect(()=>{
        setCategoriesOption(categoriesList.map((category, index) => ({
            value: category.id,
            label: category.name,
        })))
    },[categoriesList])
    useEffect(()=>{
        if(product){
            getSizesByProductTypeId(product.product_type_id)
              .then(data => {
                    setSizesList(data);
              })
              .catch(error => {
                  setError(error);
            });
        }
    },[product])
    useEffect(()=>{
        console.log(sizesList);
    },[sizesList])

    if (loading) {
        return <Loading/>;
    }
    if (error) {
        return <Error/>;
    }
    const selectAfter = (
        <Select defaultValue={unitSale} onChange={(value)=>setUnitSale(value)}>
          <Option value="%">%</Option>
          <Option value="VND">VND</Option>
        </Select>
    );

    const handleImgChange = (colorIndex, fileList) => {
        const newColors = [...product.color_product];
        console.log(fileList);
        newColors[colorIndex].images = fileList;
        setProduct({
          ...product,
          color_product: newColors,
        });
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleRemoveFile = async (file)=> {
        try {
            const imagecolorproductId = file.response ? file.response.id : file.id;
            const response = await deleteImageFromProduct(imagecolorproductId);
            console.log(response);
            return true;
        } catch (error) {
            return false;
        } 
    }


    const handleUpdateInfo = async (values) =>{
        
        try {
            const newProductInfo  = {...values, sale: values.sale + unitSale}
            console.log(newProductInfo);
            await updateProduct(id, newProductInfo);
            const notify = {
                type: 'success',
                message: "Sửa thành công sản phẩm",
                content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true);
        } catch (error) {
            const notify = {
              type: 'fail',
              message: "Không thể sửa thông tin sản phẩm",
              content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true);
        }
    }
    const onFinish = (values) => {
        console.log('Received values of form:', values);
    };
  return (
    <main>
        <div className="container-admin">
            <div className="container-admin__inner">
                <div className="container-admin-header">
                    <h4>Sản phẩm: {product.id}</h4>
                </div>
                <div className="container-admin-info">
                    <Form 
                form={form}
                {...formItemLayout} 
                onFinish={handleUpdateInfo}
                name="info-update"
                initialValues={{
                    name: product.name,
                    price: product.price,
                    sale: parseFloat(product.sale.replace('%', '')),
                    tag_id: product.tag_id,
                    description: product.description,
                    product_type_id: product.product_type_id,
                    categories: product.categories.map(cate => cate.id),
                }}
                >
                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                            <Input name="name"/>
                        </Form.Item>
                        <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}>
                            <Input addonAfter="VND" name="price" type="number"/>
                        </Form.Item>
                        <Form.Item label="Giảm giá" name="sale">
                            <Input name="sale" type="number" addonAfter={selectAfter}/>
                        </Form.Item>
                        <Form.Item label="Tag" name="tag_id" rules={[{ required: true, message: 'Vui lòng chọn tag' }]}>
                        <Select
                            options={tagsOption}
                        />
                        </Form.Item>
                        <Form.Item label="Phân loại" name="product_type_id" rules={[{ required: true, message: 'Vui lòng chọn Product Type ID' }]}>
                            <Select
                                options={typesOption}
                            />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                            <TextArea autoSize name="description" />
                        </Form.Item>
                        {/* categories */}
                        <Form.Item label="Danh mục" name="categories" >
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="Chọn danh mục"
                                options={categoriesOption}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 6 }}>
                            <Flex gap="small">
                                <Button type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                                <Button danger 
                                onClick={() => form.resetFields()}
                                >
                                    Làm mới
                                </Button>
                            </Flex>
                        </Form.Item>
                    </Form>
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
                            <Upload
                                listType="picture-card"
                                fileList={color_product.images.map(img => ({
                                    id: img.id, 
                                    name: img.name,
                                    status: "done", 
                                    url: img.url
                                }))}
                                onChange={(fileList) => handleImgChange(indexColor, fileList.fileList)}
                                onPreview={handlePreview}
                                onRemove={handleRemoveFile}
                            />
                            <Upload
                                multiple={true}
                                listType="picture-card"
                                action={`http://127.0.0.1:8000/api/product/addimage/${color_product.id}`}
                                onPreview={handlePreview}
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
                            <div className="color-sizes">
                                <div>Kích cỡ</div>
                                <Form
                                    name="dynamic_form_nest_item"
                                    onFinish={onFinish}
                                    style={{
                                    maxWidth: 600,
                                    }}
                                    autoComplete="off"
                                >
                                    <Form.List name="sizes">
                                    {(fields, { add, remove }) => (
                                        <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                marginBottom: 8,
                                            }}
                                            align="baseline"
                                            >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'size']}
                                                rules={[
                                                {
                                                    required: true,
                                                    message: 'Chưa chọn size',
                                                },
                                                ]}
                                                style={{
                                                    width: '50%',
                                                }}
                                            >
                                                <Select
                                                    
                                                >

                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'quantity']}
                                                rules={[
                                                {
                                                    required: true,
                                                    message: 'Chưa nhập số lượng',
                                                },
                                                ]}
                                            >
                                                <Input placeholder="Số lượng" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add field
                                            </Button>
                                        </Form.Item>
                                        </>
                                    )}
                                    </Form.List>
                                    <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    </Form.Item>
                                </Form>
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

export default ProductEdit