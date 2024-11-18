import React, {Component} from "react";
import axios from "axios";

export default class Catalog extends Component {
    state = {
        products: [], // Для хранения списка продуктов
        loading: true, // Индикатор загрузки
        error: null, // Для возможных ошибок
    };

    componentDidMount() {
        this.fetchProducts(); // Загружаем продукты при монтировании компонента
    }

    fetchProducts = () => {
        const config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
        };

        axios
            .get("http://localhost:8000/api/products/", config)
            .then((response) => {
                this.setState({
                    products: response.data, // Сохраняем данные в состояние
                    loading: false,
                });
            })
            .catch((error) => {
                console.error("Ошибка при загрузке продуктов:", error);
                this.setState({error: "Не удалось загрузить каталог.", loading: false});
            });
    };

    render() {
        const { products, loading, error } = this.state;

        if (loading) {
            return <p>Загрузка продуктов...</p>;
        }

        if (error) {
            return <p>{error}</p>;
        }

        return (
            <div>
                <h2 className="centered-p20">Каталог продуктов</h2>
                <div className="product-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <h3>{product.name}</h3>
                            <p>Цена: {product.price} mdl</p>
                            <p>{product.description}</p>
                            {/*<p>Наличие: {product.stock}</p>*/}
                            <button
                                onClick={() => this.props.addToCart(product)}
                                className="btn btn-primary"
                            >
                                Добавить в корзину
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

}
