import './Login.scss'
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import s_member from '../../Assets/sstyle_member.png'
import giamgia from '../../Assets/giamgia.png'
import hoantien from '../../Assets/hoan_tien.png'
import qua from '../../Assets/qua_tang.png'
import google_icon from '../../Assets/google_icon.png'
import facebook_icon from '../../Assets/facebook_icon.png'

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data  = await login(email, password);
            if (data.user.type === 1) {
                navigate('/admin');
                window.location.reload();
            } else {
                window.location.reload(); // Reset lại trang
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

  return (
    <div >
        <form onSubmit={handleLogin} id='login-form'>
            <img src={s_member} alt="" style={{height: '50px'}} />
            <div className="text--center login-heading-block">
                <div className="title">
                    Rất nhiều ưu đãi dành cho hội viên đang chờ đón bạn
                </div>
            </div>
            <div className="subtitle">
                Quyền lợi dành riêng cho bạn khi tham gia SStyle Member
            </div>
            <div className="login-items">
                <div className="login-item">
                    <img src={giamgia} alt="" />
                </div>
                <div className="login-item">
                    <img src={qua} alt="" />
                </div>
                <div className="login-item">
                    <img src={hoantien} alt="" />
                </div>
            </div>
            <p>
                <b>Đăng nhập hoặc đăng ký (miễn phí) </b>
            </p>
            <div className='flex'>
                <button type='button' className="login-provider login-provider-google">
                    <span className="login-provider-icon">
                        <img src={google_icon} alt="" />
                    </span>
                </button>
                <button type='button' className="login-provider login-provider-facebook">
                    <span className="login-provider-icon">
                        <img src={facebook_icon} alt="" />
                    </span>
                </button>
                {error && <p>{error}</p>}
            </div>
            <div className="login-or-divider">
                <span>Hoặc</span>
            </div>
            <div className="form-group">
                <input type="text" name="email" placeholder="Email/SĐT của bạn" autoFocus="autofocus" className="form-control"   onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="form-group">
                <input name="password" placeholder="Mật khẩu" type="password" className="form-control" onChange={(e) => setPassword(e.target.value)}/>
                <span className="form-icon"></span> 
            </div>
            <button type='submit' className="login-btn">Đăng nhập</button>
            <div className="auth-actions">
                <a onClick={props.onOpenRegisterPopup}>Đăng ký tài khoản mới</a>
                <a onClick={props.onOpenForgotPopup} href="#">Quên mật khẩu</a>
            </div>
        </form>
    </div>
  )
}
export default Login;