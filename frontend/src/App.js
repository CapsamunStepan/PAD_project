import React, {Component} from "react";
import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import axios from "axios";
import Home from "./components/home.component";
import Nav from "./components/nav.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Catalog from "./components/catalog.component";


export default class App extends Component {
    state = {
        user: null, // Изначально пользователь не авторизован
        cart: [],
    };

    addToCart = (product) => {
        this.setState((prevState) => {
            const existingProduct = prevState.cart.find((item) => item.id === product.id);
            if (existingProduct) {
                return {
                    cart: prevState.cart.map((item) =>
                        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                    ),
                };
            } else {
                return {
                    cart: [...prevState.cart, {...product, quantity: 1}],
                };
            }
        });
    };

    removeFromCart = (productId) => {
        this.setState((prevState) => ({
            cart: prevState.cart.filter((item) => item.id !== productId),
        }));
    };

    updateQuantity = (productId, delta) => {
        this.setState((prevState) => ({
            cart: prevState.cart.map((item) =>
                item.id === productId ? {...item, quantity: item.quantity + delta} : item
            ).filter((item) => item.quantity > 0), // Удаляем, если количество стало 0
        }));
    };

    clearCart = () => {
        this.setState({ cart: [] });
    }

    // Функция для обновления состояния пользователя
    setUser = (user) => {
        this.setState({user});
    };

    logout = () => {
        // Очищаем токены из localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Сбрасываем состояние пользователя
        this.setState({user: null});
    };

    // Загружаем профиль при первой загрузке страницы
    componentDidMount = () => {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            const config = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            };

            axios
                .get("http://localhost:8001/api/users/profile/", config)
                .then((res) => {
                    this.setState({user: res.data});
                })
                .catch((err) => {
                    console.error("Ошибка загрузки профиля:", err);
                    this.setState({user: null}); // На случай истечения токена
                });
        }
    };

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Nav
                        user={this.state.user}
                        logout={this.logout}
                        cart={this.state.cart}
                        updateQuantity={this.updateQuantity}
                        removeFromCart={this.removeFromCart}
                        clearCart={this.clearCart}
                    />
                    <div className="main_content">
                        <div className="content">
                            <Routes>
                                <Route exact path="/" element={<Home user={this.state.user}/>} />
                                <Route exact path="/login" element={<Login setUser={this.setUser}/>} />
                                <Route exact path="/register" element={<Register/>}/>
                                <Route exact path="/catalog" element={<Catalog addToCart={this.addToCart} />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
