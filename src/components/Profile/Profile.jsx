import React from "react";
import { Button, Card, Col, Form, Input, message, Row, Spin } from "antd";
import { useAuthContext } from "../../context/AuthContext";
import { API } from "../../constant";
import { useState } from "react";
import { getToken } from "../../helpers";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { user, isLoading, setUser } = useAuthContext();

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      setUser(responseData);
      message.success("Data saved successfully!");
    } catch (error) {
      console.error(Error);
      message.error("Error While Updating the Profile!");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (    
    <Card className="profile_page_card">
        <br />
        <br />
      <Form
        layout="vertical"
        initialValues={{
          username: user?.username,
          email: user?.email,
          twitter_username: user?.twitter_username,
          linkedin_username: user?.linkedin_username,
          github_username: user?.github_username,
          avatar_url: user?.avatar_url,
          website_url: user?.website_url,
          about: user?.about,
        }}
        onFinish={handleProfileUpdate}
      >
        <Row gutter={[16, 16]}>
          <Col md={8} lg={8} sm={24} xs={24}>
            <Form.Item
              label="Логин"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Введите логин!",
                  type: "string",
                },
              ]}
            >
              <Input placeholder="Логин" />
            </Form.Item>
          </Col>
          <Col md={8} lg={8} sm={24} xs={24}>
            <Form.Item
              label="Почта"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Введите почту!",
                  type: "email",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
          <Col md={8} lg={8} sm={24} xs={24}>
            <Form.Item
              label="Ссылка на аватарку"
              name="avatar_url"
              rules={[
                {
                  type: "url",
                },
              ]}
            >
              <Input placeholder="Avatar Url" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Расскажите о вас:"
              name="about"
              rules={[
                {
                  required: true,
                  type: "string",
                  max: 120,
                },
              ]}
            >
              <Input.TextArea placeholder="About" rows={6} />
            </Form.Item>
          </Col>
          <Col md={8} lg={8} sm={24} xs={24}>
            <Form.Item
              label="Узнавайте о новостях во Вконтакте:"
              name="twitter_username"
              rules={[
                {
                  type: "string",
                },
              ]}
            >
              <Input placeholder="Ссылка на ваш ВК" />
            </Form.Item>
          </Col>
          <Col md={8} lg={8} sm={24} xs={24}>
            <Form.Item
              label="Ваш номер телефона:"
              name="linkedin_username"
              rules={[
                {
                  type: "string",
                },
              ]}
            >  
              <Input placeholder="Номер телефона в формате: 8.." />
            </Form.Item>
          </Col>
        </Row>
        <Button
          className="profile_save_btn"
          htmlType="submit"
          type="primary"
          size="large"
        >
          {loading ? (
            <>
              <Spin size="small" /> Сохраняем...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </Form>
    </Card>
  );
};

export default Profile;