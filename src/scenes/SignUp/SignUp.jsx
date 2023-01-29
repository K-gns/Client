import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Row,
    Spin,
    Typography,
  } from "antd";
  import React, { Fragment, useState } from "react";
  import { Link } from "react-router-dom";
  import { useNavigate } from "react-router-dom";
  import { useAuthContext } from "../../context/AuthContext";
  //import useScreenSize from "../../hooks/useScreenSize";
  import { API } from "../../constant";
  import { setToken } from "../../helpers";
  
  const SignUp = () => {
    //const { isDesktopView } = useScreenSize();
    const navigate = useNavigate();
  
    const { setUser } = useAuthContext();
  
    const [isLoading, setIsLoading] = useState(false);
  
    const [error, setError] = useState("");
  
    const onFinish = async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API}/auth/local/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
  
        const data = await response.json();
        if (data?.error) {
          throw data?.error;
        } else {
          // set the token
          setToken(data.jwt);
  
          // set the user
          setUser(data.user);
  
          message.success(`Добро пожаловать! ${data.user.username}!`);
  
          navigate("/profile", { replace: true });
        }
      } catch (error) {
        console.error(error);
        setError(error?.message ?? "Что-то пошло не так!");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Fragment>
        <Row align="middle">
          <Col span={8 } offset={ 8 }>
            <Card title="SignUp">
              {error ? (
                <Alert
                  className="alert_error"
                  message={error}
                  type="error"
                  closable
                  afterClose={() => setError("")}
                />
              ) : null}
              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="Логин"
                  name="username"
                  rules={[
                    {
                      required: true,
                      type: "string",
                    },
                  ]}
                >
                  <Input placeholder="желаемый логин" />
                </Form.Item>
                <Form.Item
                  label="Почта"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                    },
                  ]}
                >
                  <Input placeholder="почта в формате 123@domain.com" />
                </Form.Item>
  
                <Form.Item
                  label="Пароль"
                  name="password"
                  rules={[{ required: true }]}
                >
                  <Input.Password placeholder="ваш пароль" />
                </Form.Item>
  
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login_submit_btn"
                  >
                    Подтвердить регистрацию {isLoading && <Spin size="small" />}
                  </Button>
                </Form.Item>
              </Form>
              <Typography.Paragraph className="form_help_text">
                Уже есть аккаунт? <Link to="/signin">Войти</Link>
              </Typography.Paragraph>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  };
  
  export default SignUp;