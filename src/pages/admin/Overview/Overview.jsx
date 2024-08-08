import React, { useState, useEffect, useContext } from 'react'
import './Overview.scss'
import { Col, Table, Row } from 'antd';
import LineChart from '../../../Components/Chart/LineChart'
import ColumnChart from '../../../Components/Chart/ColumnChart'
import { getOverview } from '../../../services/overview';
import { Context } from '../../../utils/context';
import Loading from '../../../Components/Admin/Loading/Loading'; 
import Error from '../../../Components/Admin/Error/Error';

const formatNumber = (num) => {
  return num.toLocaleString('de-DE'); 
};

const Overview = () => {
  const {setIsClickAdd, setNotifyContent} = useContext(Context);
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOverview()
      .then(data => {
          console.log(data);
          setOverviewData(data);
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
  const columnProduct = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      // width: '5%',
      // align: 'center',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      // width: '5%',
      render: (_, record) => {
        return (
           <div>
             {formatNumber(record.price)} Đ
           </div>
        )
      }
    },
    {
      title: 'Đã bán',
      dataIndex: 'total_sale',
      key: 'total_sale',
      // width: '5%',
    },
  ];
  const columnCategory = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '5%',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      // width: '5%',
      // align: 'center',
    },
    {
      title: 'Số sản phẩm đã bán',
      dataIndex: 'total_quantity_sold',
      key: 'total_quantity_sold',
      // width: '5%',
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'product_count',
      key: 'product_count',
      // width: '5%',
    },
  ];

  return (
    <main>
        <div className="container-admin">
            <div className="container-admin__inner">
                <div className="container-admin-header">
                    <h4>Thống kê tổng quan</h4>
                </div>
                <div className="container-overview">
                  <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                      <div className='box-thongke'>
                        <div>Doanh thu</div> 
                        <div>{formatNumber(overviewData.revenue)} Đ</div>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className='box-thongke'>
                        <div>Đơn hàng</div>
                        <div>{overviewData.total_order}</div>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className='box-thongke'>
                        <div>Đơn hàng hoàn thành</div>
                        <div>{overviewData.total_order_done}</div>
                      </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                      <div className='box-thongke'>
                        <div>Tồn kho</div> 
                        <div>{overviewData.total_quantity_product}</div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="container-table-overview">
                    <div className="table-product">
                      <h2 className='table-title'>Sản phẩm bán chạy</h2>
                      <Table 
                        dataSource={overviewData.product_best_sale} 
                        columns={columnProduct} 
                        pagination={{
                          pageSize: 5
                        }}
                      />
                    </div>
                    <div className="table-category">
                      <h2 className='table-title'>Danh mục bán chạy</h2>
                      <Table 
                        dataSource={overviewData.category_best_sale} 
                        columns={columnCategory} 
                        pagination={{
                          pageSize: 5
                        }}
                      />
                    </div>
                </div>
            </div>
        </div>
    </main>
  )
}

export default Overview