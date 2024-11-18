import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class Nav extends Component {
    state = {showCart: false}; // Состояние для модального окна

    toggleCart = () => {
        this.setState((prevState) => ({showCart: !prevState.showCart}));
    };

    handleOrder = () => {
        const {cart, user} = this.props;

        // Формируем текст сообщения
        const itemsInfo = cart.map(
            (item) => `- ${item.name}: ${item.quantity} шт. x ${item.price} mdl = ${item.quantity * item.price} mdl`
        ).join("\n");

        const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

        const message = `
        Новый заказ от пользователя: ${user?.first_name || "Гость"} (${user?.email || "Не указан"}).
        Детали заказа:
        ${itemsInfo}

        Общая сумма: ${totalAmount.toFixed(2)} mdl`;
        // Тело запроса
        const emailData = {
            message: message,
        };


        // Отправка POST-запроса
        fetch("http://localhost:8005/send-email/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Ваш заказ оформлен!");
                    this.props.clearCart(); // Очищаем корзину
                    this.toggleCart(); // Закрываем корзину
                } else {
                    alert("Ошибка! Потеряна связь с сервером!");
                }
            })
            .catch((error) => {
                console.error("Ошибка:", error);
                alert("Произошла ошибка. Проверьте соединение с сервером.");
            });
    };

    render() {
        const {cart, user, logout, updateQuantity, removeFromCart} = this.props;

        // Подсчет суммы корзины
        const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        return (
            <nav className="navbar navbar-expand navbar-light bg-light fixed-top">
                <div className="container">
                    <Link to="/" className="navbar-brand">Home</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ml-auto">
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <Link to="/catalog" className="nav-link">Catalog</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/" onClick={logout} className="nav-link">Logout</Link>
                                    </li>
                                    <li className="nav-item ms-4">
                                        <button className="btn btn-light nav-link" onClick={this.toggleCart}>
                                            🛒 {totalItems}
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/register" className="nav-link">Sign Up</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                {/* Модальное окно для корзины */}
                {this.state.showCart && (
                    <div className="cart-modal">
                        <div className="cart-content">
                            <h3 className="cart-title">Корзина</h3>
                            {cart.length > 0 ? (
                                <>
                                    {cart.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <h5>{item.name}</h5>
                                            <p>Цена: {item.price} mdl</p>
                                            <p>Количество: {item.quantity}</p>
                                            <div className="cart-item-actions">
                                                <button onClick={() => updateQuantity(item.id, 1)}
                                                        className="btn btn-sm btn-success">
                                                    +
                                                </button>
                                                <button onClick={() => updateQuantity(item.id, -1)}
                                                        className="btn btn-sm btn-danger"
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="cart-summary">
                                        <h4>Итого: {totalAmount.toFixed(2)} mdl</h4>
                                        <button
                                            className="btn btn-primary"
                                            onClick={this.handleOrder}
                                        >
                                            Оформить заказ
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p>Корзина пуста</p>
                            )}
                            <button onClick={this.toggleCart} className="btn btn-secondary mt-3 close-btn">Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        );
    }
}
