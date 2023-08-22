import { useState, useEffect } from "react";
import axios from "axios";
import favicon from "./assets/images/favicon.png";
import "./App.css";

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
    newSelect.push(meal.title, meal.price);
    setSelect(newSelect);
    console.log(select);
  };

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
        <div className="container">
          <img src={favicon} alt="Logo" />
        </div>
      </header>
      <div className="hero">
        <div className="container inner-hero">
          <div className="left-part">
            <h1>{data.restaurant.name}</h1>
            <p>{data.restaurant.description}</p>
          </div>
          <img src={data.restaurant.picture} alt="" />
        </div>
      </div>
      <main>
        <div className="container inner-main">
          <section className="col-left">
            {data.categories.map((category) => {
              if (category.meals.length !== 0) {
                return (
                  <section key={category.name}>
                    <h2>{category.name}</h2>
                    <div className="meals-container">
                      {category.meals.map((meal) => {
                        return (
                          <button
                            key={meal.id}
                            onClick={() => handleSelect(meal)}
                          >
                            <article>
                              <div>
                                <h3>{meal.title}</h3>
                                <p className="meal-description">
                                  {meal.description}
                                </p>
                                <span className="meal-price">
                                  {meal.price} €
                                </span>
                                {meal.popular === true && (
                                  <span>Populaire</span>
                                )}
                              </div>

                              {meal.picture && (
                                <img src={meal.picture} alt={meal.title} />
                              )}
                            </article>
                          </button>
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
          <section className="col-right">
            <button>Valider mon panier</button>
            {select.map((orderList, index) => {
              return (
                <div>
                  <div key={index}>{orderList}</div>
                </div>
              );
            })}
            <div>
              <div>
                Sous-total
                {}{" "}
              </div>
              <div>Frais de livraison {2.5} €</div>
            </div>
            <div>Total</div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
