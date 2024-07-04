import './Category.scss'
import cat_1 from '../../../Assets/category-1.png';
import cat_2 from '../../../Assets/category-2.png';
import cat_3 from '../../../Assets/category-3.png';
import cat_4 from '../../../Assets/category-4.png';

const Category = () => {
  return (
    <div className="shop-by-category">
      <div className="container container--full">
        <div className="grid grid--four-columns tablet-grid--four-columns mobile-grid--two-columns">
          <div className="homepage-collections__item grid__column">
            <a href="#" className="collection-grid bannercat-vitri1">
              <div className="collection-grid__thumbnail">
                <img loading="lazy" src={cat_1} alt="banner" style={{width: '100%'}}/>
              </div>
            </a>
          </div> 
          <div className="homepage-collections__item grid__column">
            <a href="#" className="collection-grid bannercat-vitri1">
              <div className="collection-grid__thumbnail">
                <img loading="lazy" src={cat_2} alt="banner" style={{width: '100%'}}/>
              </div>
            </a>
          </div> 
          <div className="homepage-collections__item grid__column">
            <a href="#" className="collection-grid bannercat-vitri1">
              <div className="collection-grid__thumbnail">
                <img loading="lazy" src={cat_3} alt="banner" style={{width: '100%'}}/>
              </div>
            </a>
          </div> 
          <div className="homepage-collections__item grid__column">
            <a href="#" className="collection-grid bannercat-vitri1">
              <div className="collection-grid__thumbnail">
                <img loading="lazy" src={cat_4} alt="banner" style={{width: '100%'}}/>
              </div>
            </a>
          </div> 
        </div>
      </div>     
    </div>
  )
}
export default Category;