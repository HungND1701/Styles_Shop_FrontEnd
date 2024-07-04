import './Home.scss'
import React, {useEffect, useState} from 'react';
import Banner from './Banner/Banner'
import Category from './Category/Category'
import Products from '../Products/Products'
import Banner_Block from '../Products/Banner/Banner'
import {getBannersHomepage} from '../../services/bannerHomepage';
import {getCategoriesProductHomepage} from '../../services/categoryHomepage'
import LoadingPopup from '../Loading/LoadingPopup';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [bannersArr, categoryHomepageArr] = await Promise.all([getBannersHomepage(), getCategoriesProductHomepage()]);
            if (Array.isArray(bannersArr)) {
              setBanners(bannersArr);
            } else {
                setBanners([]);
                console.error('Expected array but got:', bannersArr);
            }
            if (Array.isArray(categoryHomepageArr)) {
                // console.log(categoryHomepageArr);
                setCategories(categoryHomepageArr.map((data)=>data.category));
            } else {
                setCategories([]);
                console.error('Expected array but got:', categoryHomepageArr);
            }
        } catch (error) {
            setBanners([]);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);
  if (loading) {
    return <LoadingPopup/>
    // return <Loading/>;
  }
  if (error) {
    navigate('/notfound');
  }
  return (
    <main className='homepage'>
      {console.log(categories)}
      <section className='homepage-banner'>
        <Banner banners={banners.map((banner)=>banner.url)}/>
      </section>
      <section className='homepage-products'>
        <Products categoryArr={[categories[0], categories[1]]}/>
      </section>
      {
        categories.slice(2).map((category)=>{
          return <>
              <section className="banner-block">
                <Banner_Block category={category}/>
              </section>
              <section className='homepage-products'>
                <Products categoryArr={[category]}/>
              </section>
          </>
        })
      }
      <section className="homepage-collections">
        <Category/>
      </section>
    </main>
  )
}
export default Home;