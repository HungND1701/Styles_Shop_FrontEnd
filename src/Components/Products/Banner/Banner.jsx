import './Banner.scss'
const Banner = ({category}) => {
    const img = {
        name: category.name,
        src: category.banner_img_url,
        sub_title: category.sub_title,
    }
  return (
    <div class="banner-block__wrapper">
        <a href="#" ga-tracking-value="bannersection-vitri1" ga-tracking-label={img.name} style={{display: 'block', width: '100%'}}>
            <img loading="lazy" src={img.src} alt="" style={{width: '100%'}}/>
        </a> 
        <div class="banner-block__content black">
            <h2 class="banner-block__heading" style={{textTransform: 'uppercase'}}>
                    {img.name}
            </h2> 
            <p class="banner-block__descriptions">
                {img.sub_title} <br/>
            </p> 
            <div class="banner-block__button">
                <a href="" ga-tracking-value="bannersection-vitri1" ga-tracking-label={img.name} class="btn btn--white">
                        Khám phá ngay
                </a>
            </div>
        </div>
    </div>
  )
}
export default Banner;