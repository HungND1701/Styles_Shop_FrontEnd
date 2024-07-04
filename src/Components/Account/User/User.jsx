import React , {useContext, useState, useEffect} from 'react'
import { Input, DatePicker, Radio , Slider } from 'antd';
import { Context } from '../../../utils/context';
import Popup from '../../Popup/Popup';
import { FaPhoneAlt } from "react-icons/fa";
import {UserOutlined} from '@ant-design/icons';

const User = () => {
    const {user, setCurrentMenuAccount} = useContext(Context);
    const [isOpenPopupAccountInfoUpdate, setIsOpenPopupAccountInfoUpdate] = useState(false);
    const [valueGender, setValueGender] = useState(1);
    const [heightSlider, setHeightSlider] = useState(140);
    const [weightSlider, setWeightSlider] = useState(40);

    useEffect(() =>{
      setCurrentMenuAccount('1');
    }, [])
    const onChangeDoB = (date, dateString) => {
        console.log(date, dateString);
    };
    const onChangeHeight = (newValue) => {
        setHeightSlider(newValue);
    };
    const onChangeWeight = (newValue) => {
        setWeightSlider(newValue);
    };

  const onChangeGenderRadio = (e) => {
    console.log('radio checked', e.target.value);
    setValueGender(e.target.value);
  };

    const onClosePopup = ()=>{
        setIsOpenPopupAccountInfoUpdate(false)
    }
  return (
    <div id="info-tab" className="account-info">
        <h3 class="account-page-title">
            Thông tin tài khoản
        </h3>
        <div>
            <div className="account-info__form">
            <div class="account-info__field">
                <div class="account-info__label">
                Họ và tên
                </div> 
                <div class="account-info__value">
                {user.name}
                </div>
            </div>
            <div class="account-info__field">
                <div class="account-info__label">
                Số điện thoại
                </div> 
                <div class="account-info__value">
                {
                    !user.phone ? <span style={{opacity: "0.6", fontSize: "0.85em"}}>
                    <i>Chưa cập nhật!</i>
                </span> : user.phone
                }
                </div>
            </div>
            <div class="account-info__field">
                <div class="account-info__label">
                Giới tính 
                </div> 
                <div class="account-info__value">
                {
                    !user.gender ? <span style={{opacity: "0.6", fontSize: "0.85em"}}>
                    <i>Chưa cập nhật!</i>
                </span> : user.gender
                }
                </div>
            </div>
            <div class="account-info__field">
                <div class="account-info__label">
                Ngày sinh
                <i>(ngày/tháng/năm)</i>
                </div> 
                <div class="account-info__value">
                {
                    !user.dob ? <span style={{opacity: "0.6", fontSize: "0.85em"}}>
                    <i>Chưa cập nhật!</i>
                </span> : user.dob
                }
                </div>
            </div>
            <div class="account-info__field">
                <div class="account-info__label">
                Chiều cao
                </div> 
                <div class="account-info__value">
                {
                    !user.height ? <span style={{opacity: "0.6", fontSize: "0.85em"}}>
                    <i>Chưa cập nhật!</i>
                </span> : user.height
                }
                </div>
            </div>
            <div class="account-info__field">
                <div class="account-info__label">
                Cân nặng
                </div> 
                <div class="account-info__value">
                {
                    !user.weight ? <span style={{opacity: "0.6", fontSize: "0.85em"}}>
                    <i>Chưa cập nhật!</i>
                </span> : user.weight
                }
                </div>
            </div>
            <div class="account-info__field">
                <button class="btn account-info__btn" onClick={()=>setIsOpenPopupAccountInfoUpdate(true)}>
                    Cập nhật
                </button>
            </div>
            </div>
            <h3 class="account-page-title">
                Thông tin đăng nhập
            </h3>
            <div class="account-info__field">
            <div class="account-info__label">
                Email
            </div> 
            <div class="account-info__value">
                {user.email}
            </div>
            </div>
            <div class="account-info__field">
            <div class="account-info__label">
                Mật khẩu
            </div> 
            <div class="account-info__value">
                **********************
            </div>
            </div>
            <div class="account-info__field">
            <button class="btn account-info__btn">
                Cập nhật
            </button>
            </div>
        </div>
        {
        (isOpenPopupAccountInfoUpdate) &&
        (
          <Popup onClosePopup={onClosePopup}>
            <div className='updateAccountInfo'>
              <h3 className="account-page-title">
                 Chỉnh sửa thông tin tài khoản
              </h3>
              <div className="mgt--20">
                <div className="form-group form-group--user">
                  <Input size="large" placeholder="Họ và tên" prefix={<UserOutlined />} />
                </div>
                <div className="form-group form-group--date">
                  <div className='date-label'>Ngày sinh </div>
                  <DatePicker
                    format={{
                      format: 'YYYY-MM-DD',
                      type: 'mask',
                    }}
                    onChange={onChangeDoB}
                  />
                </div>
                  <Radio.Group onChange={onChangeGenderRadio} value={valueGender}>
                    <Radio value={1}>Nam</Radio>
                    <Radio value={2}>Nữ</Radio>
                    <Radio value={3}>Khác</Radio>
                  </Radio.Group>
                <div className="form-group form-group--phone">
                  <Input size="large" placeholder="Số điện thoại" prefix={<FaPhoneAlt />} />
                </div>
                <div className="grid mgb--20">
                  <div className='grid__column three-twelfths mobile--one-whole flex align--center'>
                    Chiều cao
                  </div>
                  <div className='grid__column nine-twelfths mobile--one-whole align--center'>
                    <div className="slide-group">
                      <Slider min={140} max={200} defaultValue={heightSlider} disabled={false} onChange={onChangeHeight} />
                      <span >{heightSlider+"cm"}</span>
                    </div>
                  </div>
                </div>
                <div className="grid mgb--20">
                  <div className='grid__column three-twelfths mobile--one-whole flex align--center'>
                    Cân nặng
                  </div>
                  <div className='grid__column nine-twelfths mobile--one-whole'>
                    <div className="slide-group">
                      <Slider min={40} max={100}  defaultValue={weightSlider} disabled={false}  onChange={onChangeWeight}/>
                      <span >{weightSlider+"kg"}</span>
                    </div>
                  </div>
                </div>
                <button data-v-6d14879c="" class="btn account-info__btn account-info__btn--full">
                    Cập nhật tài khoản
                </button>
              </div>
            </div>
          </Popup>
        )
      }
    </div>
  )
}

export default User