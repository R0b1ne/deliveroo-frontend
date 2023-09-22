import { useState, useEffect } from "react";
import axios from "axios";
import deliverooIcon from "./assets/images/deliverooIcon.png";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
library.add(faStar);
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  // State qui contiendra le data (la réponse du serveur)
  const [data, setData] = useState();
  // State qui me permet de savoir si la réponse du serveur est arrivée ou pas encore.
  const [isLoading, setIsLoading] = useState(true);
  //State qui crée ajoute la commande au tableau
  const [select, setSelect] = useState([]);

  const handleSelect = (meal) => {
    console.log("Meal sélectionné :", meal.title);
    const newSelect = [...select];

    const existingItem = newSelect.find((item) => item.id === meal.id);
    //Element dans le tableau? Si oui....
    if (existingItem) {
      //j'incrémente de 1 la quantité de l'élèment sur lequel j'ai cliqué si l'élément est dans mon tableau newSelect d'objet
      existingItem.quantity += 1;
      console.log(existingItem.quantity);
    } else {
      //sinon je l'ajoute au tableau newSelect
      let obj = {
        id: meal.id,
        title: meal.title,
        price: parseInt(meal.price),
        quantity: 1,
      };

      newSelect.push(obj);
      console.log(select);
    }
    setSelect(newSelect);
  };

  let total = 0;
  for (let i = 0; i < select.length; i++) {
    total = total + select[i].price * select[i].quantity;
  }

  useEffect(() => {
    // La fonction du useEffect ne peut pas être asynchrone, je déclare donc une fonction asynchrone à l'intérieur et je l'appelle immédiatement
    const fetchData = async () => {
      try {
        // Je fais une requête axios et j'attend que le résultat arrive
        const response = await axios.get(
          "https://site--deliveroo-backend--zqz8bqcfkwlv.code.run/"
        );
        // Je stocke le résultat dans mon state data
        setData(response.data);
        // Je fais paser isLoading à false
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    // J'apelle immédiatement ma fonction fetchData
    fetchData();
  }, []);

  // Si isLoading === true, c'est que la réponse du serveur n'est pas encore arrivée, donc j'affiche Chargement... afin d'éviter d'avoir une erreur car data est undefined.
  return isLoading ? (
    <p>Loading ...</p>
  ) : (
    <div>
      <header>
        <div className="Container">
          <img src={deliverooIcon} alt="Logo" />
        </div>
      </header>
      <div className="Hero">
        <div className="Container Inner-hero">
          <div className="Left-part">
            <h1>{data.restaurant.name}</h1>
            <p>{data.restaurant.description}</p>
          </div>
          <img src={data.restaurant.picture} alt="" />
        </div>
      </div>
      <main>
        <div className="Container Inner-main">
          <section className="Col-left">
            {data.categories.map((category) => {
              if (category.meals.length !== 0) {
                return (
                  <section key={category.name}>
                    <h2>{category.name}</h2>
                    <div className="Meals-container">
                      {category.meals.map((meal) => {
                        return (
                          <article
                            key={meal.id}
                            onClick={() => handleSelect(meal)}
                          >
                            <div>
                              <h3>{meal.title}</h3>
                              {meal.description && (
                                <p className="Meal-description">
                                  {meal.description}
                                </p>
                              )}

                              <span className="Meal-price">{meal.price} €</span>
                              {meal.popular === true && (
                                <span className="Popular-mention">
                                  <FontAwesomeIcon icon="star" />
                                  Populaire
                                </span>
                              )}
                            </div>
                            {meal.picture && (
                              <img src={meal.picture} alt={meal.title} />
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              } else {
                return null;
              }
            })}
          </section>
          <section className="Col-right">
            <button>Valider mon panier</button>
            <div className="Cart-item">
              {select.map((elemCart, index) => {
                return (
                  <div key={index}>
                    <span> {elemCart.quantity}</span>
                    <span> {elemCart.title} </span>
                    <span> {elemCart.price} €</span>
                  </div>
                );
              })}
            </div>

            <div className="Cart-results">
              <div>
                <p>Sous-total</p>
                <span>{total} €</span>
              </div>
              <div>
                <p>Frais de livraison </p>
                <span>{2.5} €</span>
              </div>
            </div>
            <div className="Cart-total">
              {total === 0 ? (
                ""
              ) : (
                <div>
                  <span>Total</span>
                  <span>{total + 2.5} €</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
