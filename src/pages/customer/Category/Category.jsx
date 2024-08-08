import './Category.scss'
import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Form, Checkbox } from 'antd';
import { getCategoryProduct } from '../../../services/categories';
import LoadingPopup from '../../../Components/Loading/LoadingPopup';
import Banner from '../../../Components/Products/Banner/Banner';
import Product from '../../../Components/Products/Product/Product';


const Category = () => {
  const { id } = useParams();
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeOptions, setTypeOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [data1] = await Promise.all([getCategoryProduct(id)]);
            const uniqueTypes = Array.from(new Set(data1.products.map(product => JSON.stringify(product.type))))
                            .map(type => JSON.parse(type));
            setTypeOptions(uniqueTypes);
            const uniqueTags = Array.from(new Set(data1.products.map(product => JSON.stringify(product.tag))))
                            .map(tag => JSON.parse(tag));
            const uniqueColorsMap = {};
            const uniqueSizesMap = {};
            data1.products.forEach(product => {
              product.color_product.forEach(color_pro => {
                if (!uniqueColorsMap[color_pro.color.id]) {
                  uniqueColorsMap[color_pro.color.id] = color_pro.color;
                }
                color_pro.sizes.forEach(size => {
                  if (!uniqueSizesMap[size.size.id]) {
                    uniqueSizesMap[size.size.id] = size.size;
                  }
                })
              });
            });    
            const uniqueColors = Object.values(uniqueColorsMap);
            const uniqueSizes = Object.values(uniqueSizesMap);
            const groupedSizes = uniqueSizes.reduce((acc, size) => {
                if (!acc[size.name]) {
                    acc[size.name] = { name: size.name, ids: [] };
                }
                acc[size.name].ids.push(size.id);
                return acc;
            }, {});
            
            const result = Object.values(groupedSizes);
            setSizeOptions(result);
            setColorOptions(uniqueColors);
            setTypeOptions(uniqueTypes);
            setTagOptions(uniqueTags);
            console.log(data1);
            setCategory(data1);
        } catch (error) {
            setCategory([]);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [id]);
  if (loading) {
    return <LoadingPopup/>
  }

  return (
    <main className='category'>
      <section className='category-banner'>
        <div className="banner">
            <Banner category={category} />
        </div>
      </section>
      <section className='category-products'>
        <div className="filter-product">
          <div className="filters">
              <Form> 
                <div className="filter-wrapper">
                  <div className="filter-select">
                    <div className="filter-item">
                      <h5 className="filter__heading">
                        Phân loại
                      </h5>
                      <div className="filter-checkbox">
                        <Form.Item name='type' > 
                          <Checkbox.Group className='checkbox-group'>
                            <Row>
                            {
                              typeOptions.map((type,index)=>(
                                  <Col span={24}>
                                    <Checkbox 
                                      value={type.id}
                                      style={{
                                        lineHeight: '32px',
                                        fontSize: '16px'
                                      }}
                                    >
                                      {type.name}
                                    </Checkbox>        
                                  </Col>
                              ))
                            }
                            </Row>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-item">
                      <h5 className="filter__heading">
                        Tag
                      </h5>
                      <div className="filter-checkbox">
                        <Form.Item name='tag' > 
                          <Checkbox.Group className='checkbox-group'>
                            <Row>
                            {
                              tagOptions.map((tag,index)=>(
                                  <Col span={24}>
                                    <Checkbox 
                                      value={tag.id}
                                      style={{
                                        lineHeight: '32px',
                                        fontSize: '16px',
                                        textTransform: 'capitalize'
                                      }}
                                    >
                                      {tag.name}
                                    </Checkbox>        
                                  </Col>
                              ))
                            }
                            </Row>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="filter-item">
                      <h5 className="filter__heading">
                        Kích cỡ
                      </h5>
                      <ul className="filter-select-size">
                      {
                        sizeOptions.map((size, index) => (
                          <li key={index} className="filter-select-size__item">
                            <input
                              type="checkbox"
                              id={`size_${size.name}`}
                              name="size"
                              value={size.name}
                              data-ids={JSON.stringify(size.ids)}
                            />
                            <label htmlFor={`size_${size.name}`} className="filter-select-size__button">
                              <span className="filter-select-size__label">{size.name}</span>
                            </label>
                          </li>
                        ))
                      }
                      </ul>
                    </div>
                    <div className="filter-item">
                      <h5 className="filter__heading">
                        Màu sắc
                      </h5>
                      <ul className="filter-select-color">
                      {
                        colorOptions.map((color, index) => (
                          <li key={index} className="filter-select-color__item-list">
                            <input
                              type="checkbox"
                              id={`color_${color.name}`}
                              name="color"
                              value={color.id}
                            />
                            <label htmlFor={`color_${color.name}`} className="filter-select-color__item">
                              <div class="filter-select-color__button" style={{backgroundColor: `${color.code}`}}></div>
                              <span className="filter-select-color__label">{color.name}</span>
                            </label>
                          </li>
                        ))
                      }
                      </ul>
                    </div>
                  </div>
                </div>
              </Form>
          </div>
        </div>
        <div className="product-container">
          <div className="product-title">
            <h1>Sản phẩm</h1>
          </div>
          <div className="product-grid">
            <Row gutter={16}>
              {
                category.products.map((product, index)=>(
                  <Col className="gutter-row" span={6}>
                    <Product product_data={product}/>
                  </Col>
                ))
              }
            </Row>
          </div>
        </div>
      </section>
    </main>
  )
}
export default Category;
