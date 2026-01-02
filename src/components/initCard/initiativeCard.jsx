import { Link } from "react-router-dom";
const InitiativeCard = ({imgUrl,header,content,id, unenroll }) => {
    const href = `/available/${id}`;
    return (<div className="grid-element" key={id}>
        <img src={imgUrl} alt={header} className="img-init" />
        <h5>{header}</h5>
        <p className="grid-paragraph">
            Volunteers needed: <span className="volunteers" >
                {content}
            </span>
        </p>
        <button onClick={() => unenroll(String(id))} className="unenroll-btn">Unenroll</button>
        <Link to = {href} className = "descr-btn">Learn More </Link>
    </div>)
}
export default InitiativeCard;