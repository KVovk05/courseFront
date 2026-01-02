
const Filter = ({ onChangeCategory }) => {
  return (
      <div className="filter">
          <button onClick = {e=>onChangeCategory("all")}>Всі послуги</button>
          <button onClick = {e=>onChangeCategory("regular")}>Регулярне</button>
          <button onClick = {e=>onChangeCategory("deep")}>Глибоке</button>
          <button onClick = {e=>onChangeCategory("special")}>Спеціалізоване</button>
          
    </div>
  );
}
export default Filter;