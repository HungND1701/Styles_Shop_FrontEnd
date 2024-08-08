import React, {useState, useEffect, useContext} from 'react'
import './ProductCreate.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../../../../utils/context';
import {createProduct} from '../../../../services/product';
import {getColors} from '../../../../services/color';
import {getTags} from '../../../../services/tag';
import {getTypes} from '../../../../services/type';
import {getCategories} from '../../../../services/categories';
import {getSizesByProductTypeId} from '../../../../services/size';
import {deleteFile} from '../../../../services/upload';
import Loading from '../../../../Components/Admin/Loading/Loading';
import Error from '../../../../Components/Admin/Error/Error';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    ColorPicker,
    Form,
    Input,
    Row, 
    Col,
    Select,
    Upload,
    Image
} from 'antd';
const { TextArea } = Input;
const { Option } = Select;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
  });

const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
};

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 14,
        offset: 6,
        },
    },
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
 
const ProductCreate = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const {setIsClickAdd, setNotifyContent} = useContext(Context);
    const searchParams = new URLSearchParams(location.search);
    const categoryId = parseInt(searchParams.get('category_id'), 10);
    const [categoriesList, setCategoriesList] = useState([]);
    const [colorsList, setColorsList] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [sizesList, setSizesList] = useState([]);
    const [typesList, setTypesList] = useState([]);
    const [typeSelected, setTypeSelected] = useState(null);
    // const [colorsOption, setColorsOption] = useState([]);
    const [tagsOption, setTagsOption] = useState([]);
    const [typesOption, setTypesOption] = useState([]);
    const [categoriesOption, setCategoriesOption] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unitSale, setUnitSale] = useState('%');
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [product, setProduct] = useState({
        name: '',
        price: '',
        sale: '',
        tag_id: '',
        description: '',
        product_type_id: '',
        categories: categoryId ?[categoryId]:[],
        colors: []
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [colors, tags, types, categories] = await Promise.all([getColors(), getTags(), getTypes(), getCategories()]);
                setColorsList(colors);
                setTagsList(tags);
                setTypesList(types);
                setCategoriesList(categories);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    // useEffect(()=>{
    //     setColorsOption(colorsList.map((color, index) => ({
    //         value: color.id,
    //         label: color.name,
    //     })))
    // },[colorsList])

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
        getSizesByProductTypeId(typeSelected)
          .then(data => {
                setSizesList(data);
          })
          .catch(error => {
              setError(error);
          });
    },[typeSelected])

    if (loading) {
        return <Loading/>;
    }
    if (error) {
        return <Error/>;
    }
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const selectAfter = (
        <Select defaultValue={unitSale} onChange={(value)=>setUnitSale(value)}>
          <Option value="%">%</Option>
          <Option value="VND">VND</Option>
        </Select>
    );

    const getTokenFromLocalStorage = () => {
        return sessionStorage.getItem('token'); 
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };
    const handleChangeSale = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value+unitSale
        });
    };
    const handleSelectChange = (name, value) => {
        setProduct({
          ...product,
          [name]: value,
        });
    };
    const handleSelectTypeChange = (name, value) => {
        setProduct({
          ...product,
          [name]: value,
        });
        setTypeSelected(value);
    };
    const handleCategoryChange = (value) => {
        setProduct({
          ...product,
          categories: value,
        });
    };
    const handleColorChange = (index, e) => {
        const { name, value } = e.target;
        const newColors = [...product.colors];
        newColors[index][name] = value;
        setProduct({
          ...product,
          colors: newColors,
        });
    };
    const handleColorPickerChange = (index, value) => {
        const newColors = [...product.colors];
        newColors[index].code = value.toHexString();
        setProduct({
          ...product,
          colors: newColors,
        });
    };
    const handleColorSelect = (colorIndex, value) => {
        const newColors = [...product.colors];
        if (value === 'new') {
          newColors[colorIndex] = { id: -1, name: '', code: '', imgs: [], sizes: [] };
        } else {
          const selectedColor = colorsList.find(color => color.id === value);
          newColors[colorIndex] = { ...selectedColor, imgs: [], sizes: [] };
        }
        setProduct({
          ...product,
          colors: newColors,
        });
    };

    const handleImgChange = (colorIndex, fileList) => {
        const newColors = [...product.colors];
        console.log(fileList);
        newColors[colorIndex].imgs = fileList.map((fileObject)=>({
            name: fileObject.name,
            url: fileObject.response,
        }));
        setProduct({
          ...product,
          colors: newColors,
        });
    };

    const handleSizeChange = (colorIndex, sizeIndex, name, value) => {
        const newColors = [...product.colors];
        newColors[colorIndex].sizes[sizeIndex][name] = value;
        setProduct({
            ...product,
            colors: newColors
        });
    };

    const addColor = () => {
        setProduct({
            ...product,
            colors: [...product.colors, { id: '', name: '', code: '', imgs: [], sizes: [] }]
        });
    };

    const addSize = (colorIndex) => {
        const newColors = [...product.colors];
        newColors[colorIndex].sizes.push({ id: '', quantity: '' });
        setProduct({
            ...product,
            colors: newColors
        });
    };

    const handleSubmit =  async () =>{
        console.log(product);
        try {
          const newProduct = await createProduct(product);
          const notify = {
            type: 'success',
            message: "Thêm thành công sản phẩm",
            content: null,
          }
          setNotifyContent(notify);
          setIsClickAdd(true);
          navigate(-1);
        } catch (error) {
          const notify = {
            type: 'fail',
            message: "Không thể thêm sản phẩm",
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
                    <h4>Tạo sản phẩm mới</h4>
                </div>
                <div className="form-product">
                    <Form {...formItemLayout} onFinish={handleSubmit}>
                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
                            <Input name="name" value={product.name} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}>
                            <Input addonAfter="VND" name="price" type="number" value={product.price} onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Giảm giá" name="sale">
                            <Input name="sale" type="number" addonAfter={selectAfter} value={product.sale} onChange={handleChangeSale}/>
                        </Form.Item>
                        <Form.Item label="Tag" name="tag_id" rules={[{ required: true, message: 'Vui lòng nhập chọn tag' }]}>
                        <Select
                            value={product.tag_id}
                            onChange={(value) => handleSelectChange('tag_id', value)}
                            options={tagsOption}
                        />
                        </Form.Item>
                        <Form.Item label="Phân loại" name="product_type_id" rules={[{ required: true, message: 'Vui lòng nhập Product Type ID' }]}>
                            <Select
                                value={product.product_type_id}
                                onChange={(value) => handleSelectTypeChange('product_type_id', value)}
                                options={typesOption}
                            />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                            <TextArea name="description" value={product.description} onChange={handleChange} />
                        </Form.Item>
                        {/* categories */}
                        <Form.Item label="Danh mục" name="categories" >
                            <Row gutter={16}>
                                <Col span={12}>
                                <Form.Item>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder="Chọn danh mục"
                                        defaultValue={product.categories}
                                        onChange={handleCategoryChange}
                                        options={categoriesOption}
                                    />
                                    {/* <Select
                                        name="id"
                                        defaultValue={category.id ? parseInt(category.id, 10) : null}
                                        onChange={(value) => handleCategoryChange(index, value)}
                                        options={categoriesOption}
                                    /> */}
                                </Form.Item>
                                </Col>
                            </Row>
                            {/* <Button type="dashed" onClick={addCategory}>Thêm Category</Button> */}
                        </Form.Item>    
                        {/* Colors */}
                        <Form.Item label="Colors">
                            {product.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className='color-container-item'>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item label="Chọn màu">
                                        <Select
                                            style={{maxWidth: '300px'}}
                                            placeholder="Chọn màu"
                                            value={color.id === -1 ? 'new' : color.id}
                                            onChange={(value) => handleColorSelect(colorIndex, value)}
                                        >
                                            <Option value="new" style={{color: "#1677ff"}}>Tạo màu mới</Option>
                                            {colorsList.map(color => (
                                            <Option 
                                            key={color.id} 
                                            value={color.id}
                                            disabled={product.colors.some(obj => obj.id === color.id)}
                                            >
                                                {color.name}
                                            </Option>
                                            ))}
                                        </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {(color.id || color.id === -1) && (
                                <>
                                    <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item>
                                        <Input
                                            disabled={color.id !== -1}
                                            placeholder="Name"
                                            name="name"
                                            value={color.name}
                                            onChange={(e) => handleColorChange(colorIndex, e)}
                                        />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item>
                                            <ColorPicker
                                                showText
                                                disabled={color.id !== -1}
                                                value={color.code}
                                                onChange={(value) => handleColorPickerChange(colorIndex, value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    </Row>
                                </>
                                )}

                                 {/* Images */}
                                <Form.Item label="Ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload
                                        multiple={true}
                                        listType="picture-card"
                                        action="http://127.0.0.1:8000/api/uploads/store"
                                        onPreview={handlePreview}
                                        onRemove={handleRemoveFile}
                                        onChange={(fileList) => handleImgChange(colorIndex, fileList.fileList)}
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

                                {/* Sizes */}
                                {color.sizes.map((size, sizeIndex) => (
                                <Row key={sizeIndex} gutter={16}>
                                    <Col span={12}>
                                    <Form.Item label='Size'>
                                        <Select
                                            onChange={(value) => handleSizeChange(colorIndex,sizeIndex, "id", value)}
                                            options={sizesList.map((size, i)=>({
                                                value: size.id,
                                                label: size.name,
                                                disabled: product.colors[colorIndex].sizes.some(obj => obj.id === size.id)
                                            }))}
                                        />
                                    </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item label="Số lượng">
                                        <Input
                                        placeholder="Số lượng"
                                        name="quantity"
                                        value={size.quantity}
                                        onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e.target.name, e.target.value)}
                                        />
                                    </Form.Item>
                                    </Col>
                                </Row>
                                ))}
                                <Button type="dashed" onClick={() => addSize(colorIndex)}>Thêm Size</Button>
                            </div>
                            ))}
                            <Button type="dashed" onClick={addColor}>Thêm Color</Button>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                            Tạo sản phẩm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
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
    </main>
  )
}

export default ProductCreate