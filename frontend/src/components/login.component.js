import React, {Component} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";

export default class Login extends Component {
    state = {
        redirect: false, // Контролируем редирект
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            username: this.username,
            password: this.password,
        };

        axios
            .post("http://localhost:8001/api/users/login/", data)
            .then((res) => {
                // Сохраняем токены в localStorage
                localStorage.setItem("access_token", res.data.access);
                localStorage.setItem("refresh_token", res.data.refresh);

                const config = {
                    headers: {
                        Authorization: "Bearer " + res.data.access,
                    },
                };

                // Загружаем профиль пользователя
                return axios.get("http://localhost:8001/api/users/profile/", config);
            })
            .then((res) => {
                // Обновляем состояние в App через setUser
                this.props.setUser(res.data);
                this.setState({redirect: true});
            })
            .catch((err) => {
                console.error("Ошибка авторизации:", err);
            });
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/"/>;
        }

        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.handleSubmit}>
                        <h3>Login</h3>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                onChange={(e) => (this.username = e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                onChange={(e) => (this.password = e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary btn-block">Login</button>
                    </form>
                </div>
            </div>
        );
    }
}
