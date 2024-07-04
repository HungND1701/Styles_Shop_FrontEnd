import './ForgotPassword.scss'

const ForgotPassword = (props) => {
  return (
    <div >
        <form id="forgot-form">
            <div class="text--center forgot-heading-block">
                <div class="title">Cấp lại mật khẩu</div> 
            </div> 
            <div class="form-group">
                <input type="text" name="email" placeholder="Email/SĐT của bạn" autofocus="autofocus" class="form-control"/>
            </div> 
            <button class="forgot-btn">Kiểm tra</button>
            <div class="auth-actions">
                <a onClick={props.onOpenLoginPopup} >Quay lại</a>
            </div>
        </form>
    </div>
  )
}
export default ForgotPassword;