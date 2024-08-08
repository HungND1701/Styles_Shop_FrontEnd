import React, {useContext, useState, useEffect} from 'react'
import './ProductEdit.scss'
import Loading from '../../../../Components/Admin/Loading/Loading';
import Error from '../../../../Components/Admin/Error/Error';
import Popup from '../../../../Components/Popup/Popup';
import { getProductById, updateProduct, deleteImageFromProduct, updateSizeProduct, deleteColorFromProduct, addColorToProduct, updateColorInfoProduct } from '../../../../services/product';
import {getColors} from '../../../../services/color';
import {getTags} from '../../../../services/tag';
import {getTypes} from '../../../../services/type';
import {getCategories} from '../../../../services/categories';
import {getSizesByProductTypeId} from '../../../../services/size';
import { useParams } from 'react-router-dom';
import { Input, Image, Space, ColorPicker, Tooltip, Form, Select, Button, Flex, Upload} from 'antd';
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgDanger } from "react-icons/cg";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../../utils/context';
import { deleteFile } from '../../../../services/upload';
const { TextArea } = Input;
const { Option } = Select;

const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
};
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

const boxStyle = {
    width: '100%',
    borderRadius: 8,
    border: '1px solid #d9d9d9',
    padding: '30px 30px',
    paddingBottom: '10px'
};

const ProductEdit = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [formAddColor] = Form.useForm();
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
    const [isOpenPopupAddColor, setIsOpenPopupAddColor] = useState(false);
    const [colorIdSelected, setColorIdSelected] = useState(-1);
    const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
    const [colorDeleteSelected, setColorDeleteSelected] = useState(null);

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
    },[product]);

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

    const onClosePopupAddColor = ()=>{
        setIsOpenPopupAddColor(false);
    }
    const onClosePopupDelete = ()=>{
        setIsOpenPopupDelete(false);
    }

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
    const handleRemoveFileAddColor = async (file)=> {
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
    const onFinishUpdateSize = async (values, colorProductId) => {
        try {
            await updateSizeProduct(values, colorProductId);
            const notify = {
                type: 'success',
                message: "Cập nhật kích thước thành công",
                content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true);
        } catch (error) {
            const notify = {
              type: 'fail',
              message: "Không thể cập nhật kích thước",
              content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true);
        }
    };

    const handleDeleteColor  = async (colorProductId) => {
        if(product.color_product.length <= 1){
            const notify = {
                type: 'fail',
                message: "Không thể xóa hết màu một sản phẩm",
                content: null,
              }
              setNotifyContent(notify);
              setIsClickAdd(true);
              setIsOpenPopupDelete(false);
              return;
        }else{
            try {
                await deleteColorFromProduct(colorProductId);
                const notify = {
                    type: 'success',
                    message: "Xóa màu thành công",
                    content: null,
                }
                setIsOpenPopupDelete(false);
                setNotifyContent(notify);
                setIsClickAdd(true);
                setTimeout(() => {
                    navigate(0);
                }, 1000); 
            } catch (error) {
                const notify = {
                  type: 'fail',
                  message: "Không thể xóa màu",
                  content: null,
                }
                setNotifyContent(notify);
                setIsClickAdd(true);
            }
        }
    }
    const handleChangeColor = (value) =>{
        setColorIdSelected(value);
        const selectedColor = colorsList.find(color => color.id === value);
        formAddColor.setFieldsValue({
            code: selectedColor ? selectedColor.code : '#fff',
            name: selectedColor ? selectedColor.name : '',
        });
    }
    const SubmitAddColor = async (values) => {
        const processedValues = {
            ...values,
            imgs: values.imgs.map(file => ({
              name: file.name,
              url: file.response,
            })),
        };
        try {
            await addColorToProduct(processedValues, id);
            const notify = {
                type: 'success',
                message: "Thêm màu thành công",
                content: null,
            }
            setIsOpenPopupAddColor(false);
            setNotifyContent(notify);
            setIsClickAdd(true);
            setTimeout(() => {
                navigate(0);
            }, 1000); 
        } catch (error) {
            const notify = {
              type: 'fail',
              message: "Không thể thêm màu",
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
                    <Flex justify='space-between' align='center'>
                        <h4>Màu sắc</h4>
                        <Button type="primary" onClick={()=>setIsOpenPopupAddColor(true)}> Thêm màu</Button>
                    </Flex>
                </div>
                {
                    product.color_product.map((color_product, indexColor)=> (
                        <div key={indexColor} className="container-product-color" >
                            <Flex justify='space-between' align='flex-end'>
                                <div>Thông tin</div>
                                <Tooltip title="Xóa" placement="top">
                                    <Button danger shape="circle" icon={<RiDeleteBin6Line />} style={{opacity: "0.7"}} 
                                    onClick={()=>{
                                        setIsOpenPopupDelete(true);
                                        setColorDeleteSelected(color_product);
                                    }}
                                    />
                                </Tooltip>
                            </Flex>
                            <div 
                            style={{
                                borderRadius: 8,
                                border: '1px solid #d9d9d9',
                                padding: '30px 30px',
                                paddingBottom: '10px',
                                margin: "0px 30px"
                            }}
                            >
                                <ChildForm 
                                key={color_product.id}
                                color_product={color_product} 
                                colorsList={colorsList}
                                />
                            </div>
                            <div className="color-images">
                                <div>Hình ảnh</div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10,
                                    borderRadius: 8,
                                    border: '1px solid #d9d9d9',
                                    padding: '30px 30px',
                                    margin: "10px 30px"}} >
                                    <Upload
                                        listType="picture-card"
                                        style={{marginTop : "15px"}}
                                        fileList={color_product.images.map(img => ({
                                            id: img.id, 
                                            name: img.name,
                                            status: "done", 
                                            url: img.url
                                        }))}
                                        onChange={(fileList)=>handleImgChange(indexColor, fileList.fileList)}
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

                                </div>
                            </div>
                            <div className="color-sizes">
                                <div>Kích cỡ</div>
                                <Form
                                    name={`sizes_form_${color_product.id}`}
                                    onFinish={(values)=>onFinishUpdateSize(values, color_product.id)}
                                    style={{
                                    maxWidth: '100%',
                                    margin: "10px 30px"
                                    }}
                                    autoComplete="off"
                                    initialValues={{
                                        sizes : color_product.sizes.map(size_color_product=>({
                                        id : size_color_product.size.id, 
                                        quantity : size_color_product.quantity
                                    }))}}
                                >
                                    <Flex style={boxStyle} justify='space-between' align='flex-start'>
                                        <div>
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
                                                        name={[name, 'id']}
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Chưa chọn size',
                                                        },
                                                        ]}
                                                    >
                                                        <Select
                                                        options={sizesList.map((size, i)=>({
                                                            value: size.id,
                                                            label: size.name,
                                                            disabled: product.color_product[indexColor].sizes.some(obj => obj.id === size.id)
                                                        }))}
                                                        style={{width: "190px"}}
                                                        />   
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
                                                        <Input placeholder="Số lượng" type='number'/>
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                    </Space>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Thêm kích cỡ mới
                                                    </Button>
                                                </Form.Item>
                                                </>
                                            )}
                                            </Form.List>
                                        </div>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Cập nhật
                                            </Button>
                                        </Form.Item>

                                    </Flex>
                                </Form>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                isOpenPopupAddColor &&(
                    <Popup onClosePopup={onClosePopupAddColor}>
                    <div className="popup-header">
                        <h2>Thêm màu mới vào sản phẩm</h2>
                    </div>
                    <div className="popup-content">
                        <div className="form_container">
                        <Form 
                        form={formAddColor}
                        name="add-color"
                        {...formItemLayout} 
                        onFinish={SubmitAddColor}
                        initialValues={{
                            id : -1, 
                            code : '#fff',
                        }
                        }
                        >
                            <Form.Item label="Màu" name="id">
                                <Select
                                placeholder="Chọn màu"
                                onChange={(value)=>{
                                    handleChangeColor(value);
                                }}
                                >
                                    <Option key={0} value={-1} style={{color: "#1677ff"}}>Tạo màu mới</Option>
                                    {colorsList.map(color => (
                                        <Option key={color.id}
                                         value={color.id}
                                        >
                                            {color.name}
                                        </Option>
                                        ))}
                                </Select>
                            </Form.Item>
                            <Form.Item hidden={colorIdSelected!==-1} label='Tên màu' name='name'>
                                <Input placeholder='Nhập tên màu'
                                    disabled={colorIdSelected!==-1}
                                >
                                </Input>
                            </Form.Item>
                            <Form.Item label='Mã màu' name='code'>
                                <ColorPicker
                                    showText
                                    disabled={colorIdSelected!==-1}
                                />
                            </Form.Item>
                            <Form.Item label='Ảnh' name='imgs' valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload
                                multiple={true}
                                listType="picture-card"
                                action="http://127.0.0.1:8000/api/uploads/store"
                                onPreview={handlePreview}
                                onRemove={handleRemoveFileAddColor}
                                headers={{
                                    Authorization: `Bearer ${getTokenFromLocalStorage()}`, // Thêm token vào Header Authorization
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
                            <Form.Item label="Kích thước">
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
                                            name={[name, 'id']}
                                            rules={[
                                            {
                                                required: true,
                                                message: 'Chưa chọn size',
                                            },
                                            ]}
                                        >
                                            <Select
                                            options={sizesList.map((size, i)=>({
                                                value: size.id,
                                                label: size.name,
                                                // disabled: product.color_product[indexColor].sizes.some(obj => obj.id === size.id)
                                            }))}
                                            style={{width: "100px"}}
                                            />   
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
                                            <Input placeholder="Số lượng" type='number'/>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm kích cỡ mới
                                        </Button>
                                    </Form.Item>
                                    </>
                                )}
                                </Form.List>
                            </Form.Item>
                            <Flex justify='flex-end'> 
                                <Button type="primary" htmlType="submit" >
                                    Thêm màu
                                </Button>
                            </Flex>
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
                        Xác nhận xóa
                        <span> Màu {colorDeleteSelected.color.name}</span>
                        </div>
                    </div>
                    <div className="btn-submit">
                        <Button danger type="primary" onClick={()=>setIsOpenPopupDelete(false)}>Hủy</Button>
                        <Button type="primary" onClick={()=>handleDeleteColor(colorDeleteSelected.id)}>Xác Nhận</Button>
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

const ChildForm = ({ color_product, colorsList }) => {
    const [form] = Form.useForm(); // Sử dụng useForm để lưu trữ form instance
    const {setNotifyContent, setIsClickAdd} = useContext(Context);
  
    const handleChangeColorUpdate = (value, colorProductId) => {
      const selectedColor = colorsList.find(color => color.id === value);
      if (selectedColor && form) {
        const updatedValues = {
          id: value,
          code: selectedColor.code,
        };
        form.setFieldsValue(updatedValues);
      }
    };
  
    const SubmitUpdateInfoColor = async (values, colorProductId) =>{
        console.log(values);
        try {
            await updateColorInfoProduct(values, colorProductId);
            const notify = {
                type: 'success',
                message: "Sửa thông tin màu thành công",
                content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true); 
        } catch (error) {
            const notify = {
              type: 'fail',
              message: "Không thể sửa thông tin màu",
              content: null,
            }
            setNotifyContent(notify);
            setIsClickAdd(true);
        }
    }
  
    return (
      <Form
        key={color_product.id}
        form={form}
        name={`update_info_color_${color_product.id}`}
        onFinish={values => SubmitUpdateInfoColor(values,color_product.id)}
        initialValues={{
          id: color_product.color.id,
          code: color_product.color.code,
        }}
        style={{
          maxWidth: '100%',
        }}
      >
        <Flex justify='space-between'>
            <div>
                <Form.Item label="Màu" name="id">
                <Select
                    placeholder="Chọn màu"
                    onChange={(value) => handleChangeColorUpdate(value, color_product.id)}
                >
                    {colorsList.map(color => (
                    <Select.Option key={color.id} value={color.id}>
                        {color.name}
                    </Select.Option>
                    ))}
                </Select>
                </Form.Item>
                <Form.Item label='Mã màu' name='code'>
                    <ColorPicker
                    showText
                    disabled={true}
                    />
                </Form.Item>
            </div>
            <Form.Item>
            <Button type="primary" htmlType="submit">
                Cập nhật
            </Button>
            </Form.Item>
        </Flex>
      </Form>
    );
  };

export default ProductEdit