import { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin, useRegister } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials, RegisterCredentials } from '../types';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const onLogin = async (values: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(values);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const onRegister = async (values: RegisterCredentials) => {
    try {
      await registerMutation.mutateAsync(values);
      message.success('Đăng ký thành công!');
      navigate('/');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <Tabs
          activeKey={isLogin ? 'login' : 'register'}
          onChange={(key) => setIsLogin(key === 'login')}
          items={[
            {
              key: 'login',
              label: 'Đăng nhập',
              children: (
                <Form
                  name="login"
                  onFinish={onLogin}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Tên đăng nhập"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Mật khẩu"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loginMutation.isPending}
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'register',
              label: 'Đăng ký',
              children: (
                <Form
                  name="register"
                  onFinish={onRegister}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                      { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Tên đăng nhập"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Mật khẩu"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={registerMutation.isPending}
                    >
                      Đăng ký
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

