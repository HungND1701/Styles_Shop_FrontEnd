import './Register.scss'
import s_member from '../../Assets/sstyle_member.png'
import giamgia from '../../Assets/giamgia.png'
import hoantien from '../../Assets/hoan_tien.png'
import qua from '../../Assets/qua_tang.png'
import google_icon from '../../Assets/google_icon.png'
import facebook_icon from '../../Assets/facebook_icon.png'

const Register = (props) => {
  return (
    <div >
        <form action="" id='register-form'>
            <img src={s_member} alt="" style={{height: '50px'}} />
            <div className="text--center register-heading-block">
                <div className="title">
                    Rất nhiều ưu đãi dành cho hội viên đang chờ đón bạn
                </div>
            </div>
            <div className="subtitle">
                Quyền lợi dành riêng cho bạn khi tham gia SStyle Member
            </div>
            <div className="register-items">
                <div className="register-item">
                    <img src={giamgia} alt="" />
                </div>
                <div className="register-item">
                    <img src={qua} alt="" />
                </div>
                <div className="register-item">
                    <img src={hoantien} alt="" />
                </div>
            </div>
            <p>
                <b>Đăng nhập hoặc đăng ký (miễn phí) </b>
            </p>
            <div className='flex'>
                <button type='button' className="register-provider register-provider-google">
                    <span className="register-provider-icon">
                        <img src={google_icon} alt="" />
                    </span>
                </button>
                <button type='button' className="register-provider register-provider-facebook">
                    <span className="register-provider-icon">
                        <img src={facebook_icon} alt="" />
                    </span>
                </button>
            </div>
            <div className="register-or-divider">
                <span>Hoặc</span>
            </div>
            <div class="form-group-row">
                <div class="form-group">
                    <input type="text" name="fullname" placeholder="Tên của bạn" autofocus="autofocus" class="form-control"/> 
                </div> 
                <div class="form-group">
                    <input type="tel" name="phone" placeholder="SĐT của bạn" class="form-control"/>
                </div>
            </div>
            <div class="form-group"><input type="email" name="email" placeholder="Email của bạn" class="form-control"/></div>
            <div class="form-group"><input type="password" name="password" placeholder="Mật khẩu" class="form-control"/></div>
            <div class="form-group"><input type="password" name="rePassword" placeholder="Nhập lại mật khẩu" class="form-control"/></div>
            <button className="register-btn">Đăng ký</button>
            <div class="auth-actions">
                <a onClick={props.onOpenLoginPopup} >Đăng nhập</a>
            </div>
        </form>
    </div>
  )
}
export default Register;