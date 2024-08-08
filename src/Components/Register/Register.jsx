import React, {useState, useContext} from 'react';
import './Register.scss'
import s_member from '../../Assets/sstyle_member.png'
import giamgia from '../../Assets/giamgia.png'
import hoantien from '../../Assets/hoan_tien.png'
import qua from '../../Assets/qua_tang.png'
import google_icon from '../../Assets/google_icon.png'
import facebook_icon from '../../Assets/facebook_icon.png'
import { register } from '../../services/auth'
import { Context } from '../../utils/context';

const Register = (props) => {
    const {setNotifyContent, setIsClickAdd} = useContext(Context);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
        setError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Tên của bạn không được để trống';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'SĐT của bạn không được để trống';
        if (!formData.email) newErrors.email = 'Email của bạn không được để trống';
        if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
        if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = 'Mật khẩu không khớp';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(formData);
            try {
                const response  = await register(formData);
                const notify = {
                    type: 'success',
                    message: "Đăng kí thành công",
                    content: null,
                }
                setNotifyContent(notify);
                setIsClickAdd(true);
                props.onOpenLoginPopup();
            } catch (error) {
                const notify = {
                    type: 'fail',
                    message: "Đăng kí không thành công",
                    content: null,
                  }
                  setNotifyContent(notify);
                  setIsClickAdd(true);
            }
        }
    };
  return (
    <div >
        <form onSubmit={handleRegister} id='register-form'>
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
            <div className="form-group-row">
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Tên của bạn"
                        autoFocus
                        className="form-control"
                        
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="SĐT của bạn"
                        className="form-control"
                        
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                    />
                    {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                </div>
            </div>
            <div className="form-group">
                <input
                    type="email"
                    name="email"
                    placeholder="Email của bạn"
                    className="form-control"
                    
                    value={formData.email}
                    onChange={handleInputChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    className="form-control"
                    
                    value={formData.password}
                    onChange={handleInputChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group">
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Nhập lại mật khẩu"
                    className="form-control"
                    
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                />
                {errors.password_confirmation && <span className="error">{errors.password_confirmation}</span>}
            </div>
            <button type='submit' className="register-btn">Đăng ký</button>
            {error && <span className="error">{error}</span>}
            <div class="auth-actions">
                <a onClick={props.onOpenLoginPopup} >Đăng nhập</a>
            </div>
        </form>
    </div>
  )
}
export default Register;