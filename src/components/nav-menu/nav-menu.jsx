import { Link } from "react-router-dom";
import { useUser } from "../../pages/UserContext"; // не забудь імпорт!
const NavMenu = () => {
  const user = useUser();
    return (
    <header>
        <nav>
          <Link to="/" id="href-logo">
            <img src="/img/cleaningL.png" alt="logo" id="logo" />
          </Link>
          <ul>
            <li><Link to="/services" className="nav">Послуги</Link></li>
            {/* <li><Link to="/gallery" className="nav">Галерея робіт</Link></li> */}
            <li><Link to="/calculator" className="nav">Калькулятор</Link></li>
            <li><Link to="/about" className="nav">Про нас</Link></li>
            
            {user ? (
          <>
            <li><Link to="/orders" className="nav">Мої замовлення</Link></li>
            <li>
                <Link to="/account" className="reg">
                <img src="/img/user.png" alt="user" id="user-logo" />
                </Link>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/register" className="reg">Реєстрація</Link></li>
            <li><Link to="/login" className="reg">Вхід</Link></li>
          </>
        )}
          </ul>
        </nav>
    </header>
    )
}
export default NavMenu;